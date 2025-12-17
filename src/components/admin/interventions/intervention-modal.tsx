'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Intervention {
  id?: string;
  slug: string;
  name: string;
  name_ms: string | null;
  description: string | null;
  description_ms: string | null;
  category: string;
  is_premium: boolean;
  is_published: boolean;
  estimated_duration_minutes: number | null;
  thumbnail_url: string | null;
  video_intro_url: string | null;
}

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  intervention?: Intervention | null;
}

const CATEGORIES = [
  'anxiety',
  'depression',
  'insomnia',
  'ocd',
  'ptsd',
  'marital-distress',
  'sexual-addiction',
  'suicidal',
  'general',
];

export function InterventionModal({
  isOpen,
  onClose,
  onSave,
  intervention,
}: InterventionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    name_ms: '',
    slug: '',
    description: '',
    description_ms: '',
    category: 'general',
    is_premium: true,
    is_published: false,
    estimated_duration_minutes: '',
    thumbnail_url: '',
    video_intro_url: '',
  });

  useEffect(() => {
    if (intervention) {
      setFormData({
        name: intervention.name || '',
        name_ms: intervention.name_ms || '',
        slug: intervention.slug || '',
        description: intervention.description || '',
        description_ms: intervention.description_ms || '',
        category: intervention.category || 'general',
        is_premium: intervention.is_premium ?? true,
        is_published: intervention.is_published ?? false,
        estimated_duration_minutes: intervention.estimated_duration_minutes?.toString() || '',
        thumbnail_url: intervention.thumbnail_url || '',
        video_intro_url: intervention.video_intro_url || '',
      });
    } else {
      setFormData({
        name: '',
        name_ms: '',
        slug: '',
        description: '',
        description_ms: '',
        category: 'general',
        is_premium: true,
        is_published: false,
        estimated_duration_minutes: '',
        thumbnail_url: '',
        video_intro_url: '',
      });
    }
    setError('');
  }, [intervention, isOpen]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !intervention ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = intervention
        ? `/api/admin/interventions/${intervention.id}`
        : '/api/admin/interventions';

      const response = await fetch(url, {
        method: intervention ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimated_duration_minutes: formData.estimated_duration_minutes
            ? parseInt(formData.estimated_duration_minutes)
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save intervention');
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
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-800 rounded-xl border border-neutral-700 shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-neutral-700 bg-neutral-800">
          <h2 className="text-lg font-bold text-white">
            {intervention ? 'Edit Intervention' : 'Create Intervention'}
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

          {/* Name (EN) */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Name (English) *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Depression Management"
              required
            />
          </div>

          {/* Name (MS) */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Name (Malay)
            </label>
            <input
              type="text"
              value={formData.name_ms}
              onChange={(e) => setFormData({ ...formData, name_ms: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Pengurusan Kemurungan"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="depression-management"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Description (EN) */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Description (English)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="A comprehensive program for managing depression..."
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
              rows={3}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Program komprehensif untuk menguruskan kemurungan..."
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.estimated_duration_minutes}
              onChange={(e) => setFormData({ ...formData, estimated_duration_minutes: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="60"
              min="1"
            />
          </div>

          {/* Video Intro URL */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Video Intro URL
            </label>
            <input
              type="url"
              value={formData.video_intro_url}
              onChange={(e) => setFormData({ ...formData, video_intro_url: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_premium}
                onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-600 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-300">Premium Content</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-600 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-300">Published</span>
            </label>
          </div>

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
              {intervention ? 'Save Changes' : 'Create Intervention'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
