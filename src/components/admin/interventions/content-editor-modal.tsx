'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Video, FileText } from 'lucide-react';

interface ContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  interventionId: string;
  chapterId: string;
  chapterTitle: string;
}

export function ContentEditorModal({
  isOpen,
  onClose,
  onSave,
  interventionId,
  chapterId,
  chapterTitle,
}: ContentEditorModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'video'>('content');
  const [formData, setFormData] = useState({
    title_en: '',
    title_ms: '',
    content_en: '',
    content_ms: '',
    summary_en: '',
    summary_ms: '',
    video_url: '',
    video_provider: 'youtube',
    video_title: '',
    video_title_ms: '',
    video_duration_seconds: '',
    is_published: true,
  });

  useEffect(() => {
    if (isOpen && chapterId) {
      fetchContent();
    }
  }, [isOpen, chapterId]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/interventions/${interventionId}/chapters/${chapterId}/content`
      );
      const data = await response.json();

      if (data.editedContent) {
        setFormData({
          title_en: data.editedContent.title_en || '',
          title_ms: data.editedContent.title_ms || '',
          content_en: data.editedContent.content_en || '',
          content_ms: data.editedContent.content_ms || '',
          summary_en: data.editedContent.summary_en || '',
          summary_ms: data.editedContent.summary_ms || '',
          video_url: data.editedContent.video_url || '',
          video_provider: data.editedContent.video_provider || 'youtube',
          video_title: data.editedContent.video_title || '',
          video_title_ms: data.editedContent.video_title_ms || '',
          video_duration_seconds: data.editedContent.video_duration_seconds?.toString() || '',
          is_published: data.editedContent.is_published ?? true,
        });
      } else if (data.chapter) {
        // Pre-fill from chapter data
        setFormData((prev) => ({
          ...prev,
          title_en: data.chapter.title || '',
          title_ms: data.chapter.title_ms || '',
          content_en: data.chapter.kb_articles?.content || '',
        }));
      }
    } catch (err) {
      console.error('Failed to fetch content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(
        `/api/admin/interventions/${interventionId}/chapters/${chapterId}/content`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            video_duration_seconds: formData.video_duration_seconds
              ? parseInt(formData.video_duration_seconds)
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save content');
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-neutral-800 rounded-xl border border-neutral-700 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div>
            <h2 className="text-lg font-bold text-white">Edit Content</h2>
            <p className="text-sm text-neutral-400">{chapterTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-700">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'content'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Content
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'video'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            Video
          </button>
        </div>

        {/* Form */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {activeTab === 'content' && (
              <>
                {/* Summary (EN) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Summary (English)
                  </label>
                  <textarea
                    value={formData.summary_en}
                    onChange={(e) => setFormData({ ...formData, summary_en: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Brief summary of this chapter..."
                  />
                </div>

                {/* Summary (MS) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Summary (Malay)
                  </label>
                  <textarea
                    value={formData.summary_ms}
                    onChange={(e) => setFormData({ ...formData, summary_ms: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Ringkasan ringkas bab ini..."
                  />
                </div>

                {/* Content (EN) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Content (English) - Markdown supported
                  </label>
                  <textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    rows={12}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
                    placeholder="# Chapter Content&#10;&#10;Write your content here using Markdown..."
                  />
                </div>

                {/* Content (MS) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Content (Malay) - Markdown supported
                  </label>
                  <textarea
                    value={formData.content_ms}
                    onChange={(e) => setFormData({ ...formData, content_ms: e.target.value })}
                    rows={12}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
                    placeholder="# Kandungan Bab&#10;&#10;Tulis kandungan anda di sini menggunakan Markdown..."
                  />
                </div>
              </>
            )}

            {activeTab === 'video' && (
              <>
                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                {/* Video Provider */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Provider
                  </label>
                  <select
                    value={formData.video_provider}
                    onChange={(e) => setFormData({ ...formData, video_provider: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                  </select>
                </div>

                {/* Video Title (EN) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Video Title (English)
                  </label>
                  <input
                    type="text"
                    value={formData.video_title}
                    onChange={(e) => setFormData({ ...formData, video_title: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Understanding Anxiety"
                  />
                </div>

                {/* Video Title (MS) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Video Title (Malay)
                  </label>
                  <input
                    type="text"
                    value={formData.video_title_ms}
                    onChange={(e) => setFormData({ ...formData, video_title_ms: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Memahami Kebimbangan"
                  />
                </div>

                {/* Video Duration */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.video_duration_seconds}
                    onChange={(e) => setFormData({ ...formData, video_duration_seconds: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="300"
                    min="1"
                  />
                </div>
              </>
            )}

            {/* Published */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-600 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-300">Published (visible to users)</span>
            </label>
          </form>
        )}

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-neutral-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving || loading}
            className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Content
          </button>
        </div>
      </div>
    </div>
  );
}
