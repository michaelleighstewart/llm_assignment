'use client';

import { useState } from 'react';
import { Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

interface Record {
  id: number;
  title?: string | null;
  description: string;
}

interface RecordCardProps {
  record: Record;
  onUpdate: (id: number, data: { title?: string; description: string }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function RecordCard({ record, onUpdate, onDelete }: RecordCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(record.title || '');
  const [description, setDescription] = useState(record.description);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(record.id, { title, description });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(record.title || '');
    setDescription(record.description);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(record.id);
    } catch (error) {
      console.error('Error deleting:', error);
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
        <div className="space-y-4">
          <div>
            <label htmlFor={`title-${record.id}`} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              id={`title-${record.id}`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Enter a title..."
            />
          </div>
          <div>
            <label htmlFor={`description-${record.id}`} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id={`description-${record.id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Enter description..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Save
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-xl">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
            <Loader2 size={20} className="animate-spin" />
            Deleting...
          </div>
        </div>
      )}
      {record.title && (
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {record.title}
        </h3>
      )}
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-5 leading-relaxed">{record.description}</p>
      <div className="flex gap-3">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Pencil size={16} />
          Edit
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

