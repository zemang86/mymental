'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Chapter {
  id?: string;
  title: string;
  title_ms: string | null;
  description: string | null;
  description_ms: string | null;
  is_free_preview: boolean;
  kb_article_id: string | null;
}

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  interventionId: string;
  chapter?: Chapter | null;
}

export function ChapterModal({
  isOpen,
  onClose,
  onSave,
  interventionId,
  chapter,
}: ChapterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    title_ms: '',
    description: '',
    description_ms: '',
    is_free_preview: false,
  });

  useEffect(() => {
    if (chapter) {
      setFormData({
        title: chapter.title || '',
        title_ms: chapter.title_ms || '',
        description: chapter.description || '',
        description_ms: chapter.description_ms || '',
        is_free_preview: chapter.is_free_preview || false,
      });
    } else {
      setFormData({
        title: '',
        title_ms: '',
        description: '',
        description_ms: '',
        is_free_preview: false,
      });
    }
    setError('');
  }, [chapter, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = chapter?.id
        ? `/api/admin/interventions/${interventionId}/chapters/${chapter.id}`
        : `/api/admin/interventions/${interventionId}/chapters`;

      const response = await fetch(url, {
        method: chapter?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save chapter');
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-neutral-800 rounded-xl border border-neutral-700 shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-neutral-700 bg-neutral-800">
          <h2 className="text-lg font-bold text-white">
            {chapter?.id ? 'Edit Chapter' : 'Add Chapter'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Title (EN) */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Title (English) *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Introduction to Anxiety"
              required
            />
          </div>

          {/* Title (MS) */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Title (Malay)
            </label>
            <input
              type="text"
              value={formData.title_ms}
              onChange={(e) => setFormData({ ...formData, title_ms: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Pengenalan kepada Kebimbangan"
            />
          </div>

          {/* Description (EN) */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Description (English)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Learn the basics of anxiety and its effects..."
            />
          </div>

          {/* Description (MS) */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Description (Malay)
            </label>
            <textarea
              value={formData.description_ms}
              onChange={(e) => setFormData({ ...formData, description_ms: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Pelajari asas kebimbangan dan kesannya..."
            />
          </div>

          {/* Free Preview */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_free_preview}
              onChange={(e) => setFormData({ ...formData, is_free_preview: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-600 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-300">Free Preview (available to non-premium users)</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {chapter?.id ? 'Save Changes' : 'Add Chapter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
