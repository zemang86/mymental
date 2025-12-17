'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  FileText,
  Eye,
  EyeOff,
  ChevronRight,
} from 'lucide-react';
import { ChapterModal } from './chapter-modal';
import { ContentEditorModal } from './content-editor-modal';
import { DeleteModal } from './delete-modal';

interface Chapter {
  id: string;
  chapter_order: number;
  title: string;
  title_ms: string | null;
  description: string | null;
  description_ms: string | null;
  is_free_preview: boolean;
  kb_article_id: string | null;
  created_at: string;
}

interface ChapterManagerProps {
  interventionId: string;
  chapters: Chapter[];
}

export function ChapterManager({
  interventionId,
  chapters: initialChapters,
}: ChapterManagerProps) {
  const router = useRouter();
  const [chapters, setChapters] = useState(initialChapters);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleEdit = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setShowEditModal(true);
  };

  const handleDelete = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setShowDeleteModal(true);
  };

  const handleEditContent = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setShowContentModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedChapter) return;

    try {
      const response = await fetch(
        `/api/admin/interventions/${interventionId}/chapters/${selectedChapter.id}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setChapters((prev) => {
          const filtered = prev.filter((c) => c.id !== selectedChapter.id);
          // Reorder remaining chapters
          return filtered.map((c, i) => ({ ...c, chapter_order: i + 1 }));
        });
        setShowDeleteModal(false);
        setSelectedChapter(null);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSave = () => {
    router.refresh();
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newChapters = [...chapters];
    const draggedItem = newChapters[draggedIndex];
    newChapters.splice(draggedIndex, 1);
    newChapters.splice(index, 0, draggedItem);

    // Update order numbers
    const reordered = newChapters.map((c, i) => ({
      ...c,
      chapter_order: i + 1,
    }));

    setChapters(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    // Save new order to server
    try {
      await fetch(`/api/admin/interventions/${interventionId}/chapters`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapters: chapters.map((c) => ({
            id: c.id,
            chapter_order: c.chapter_order,
          })),
        }),
      });
    } catch (error) {
      console.error('Failed to save order:', error);
    }

    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Chapters</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Chapter
        </button>
      </div>

      {/* Chapters List */}
      <div className="rounded-xl bg-neutral-800 border border-neutral-700 divide-y divide-neutral-700">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-4 p-4 hover:bg-neutral-700/50 transition-colors ${
              draggedIndex === index ? 'opacity-50 bg-neutral-700' : ''
            }`}
          >
            {/* Drag Handle */}
            <div className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-5 h-5 text-neutral-500" />
            </div>

            {/* Order Number */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-700 text-sm font-medium text-white">
              {chapter.chapter_order}
            </div>

            {/* Chapter Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-white truncate">
                  {chapter.title}
                </h3>
                {chapter.is_free_preview && (
                  <span className="inline-flex px-2 py-0.5 bg-green-500/10 rounded text-xs text-green-400">
                    Free Preview
                  </span>
                )}
              </div>
              {chapter.description && (
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {chapter.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleEditContent(chapter)}
                className="p-2 hover:bg-neutral-600 rounded-lg"
                title="Edit content"
              >
                <FileText className="w-4 h-4 text-neutral-400" />
              </button>
              <button
                onClick={() => handleEdit(chapter)}
                className="p-2 hover:bg-neutral-600 rounded-lg"
                title="Edit chapter"
              >
                <Edit className="w-4 h-4 text-neutral-400" />
              </button>
              <button
                onClick={() => handleDelete(chapter)}
                className="p-2 hover:bg-neutral-600 rounded-lg"
                title="Delete chapter"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}

        {chapters.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-neutral-500">No chapters yet. Add your first chapter to get started.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ChapterModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSave}
        interventionId={interventionId}
      />

      <ChapterModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedChapter(null);
        }}
        onSave={handleSave}
        interventionId={interventionId}
        chapter={selectedChapter}
      />

      <ContentEditorModal
        isOpen={showContentModal}
        onClose={() => {
          setShowContentModal(false);
          setSelectedChapter(null);
        }}
        onSave={handleSave}
        interventionId={interventionId}
        chapterId={selectedChapter?.id || ''}
        chapterTitle={selectedChapter?.title || ''}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedChapter(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Chapter"
        message="Are you sure you want to delete this chapter? User progress for this chapter will also be deleted."
        itemName={selectedChapter?.title}
      />
    </div>
  );
}
