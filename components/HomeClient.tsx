'use client';

import { useState, useTransition } from 'react';
import { PromptForm } from '@/components/PromptForm';
import { RecordsList } from '@/components/RecordsList';
import { submitPrompt } from '@/lib/actions/prompts';
import { updateRecord, deleteRecord } from '@/lib/actions/records';

interface Record {
  id: number;
  title?: string | null;
  description: string;
}

interface Prompt {
  id: number;
  content: string;
}

interface HomeClientProps {
  initialRecords: Record[];
  initialPrompt: Prompt | null;
}

export function HomeClient({ initialRecords, initialPrompt }: HomeClientProps) {
  const [records, setRecords] = useState<Record[]>(initialRecords);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(initialPrompt);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmitPrompt = async (prompt: string) => {
    setError(null);

    startTransition(async () => {
      const result = await submitPrompt(prompt);

      if (result.success) {
        if (result.prompt) {
          setCurrentPrompt(result.prompt);
        }
        if (result.records) {
          setRecords(result.records);
        }
      } else {
        setError(result.error || 'An error occurred');
      }
    });
  };

  const handleUpdateRecord = async (id: number, data: { title?: string; description: string }) => {
    const result = await updateRecord(id, data);

    if (result.success && result.record) {
      setRecords(records.map(r => r.id === id ? result.record! : r));
    } else {
      throw new Error(result.error || 'Failed to update record');
    }
  };

  const handleDeleteRecord = async (id: number) => {
    const result = await deleteRecord(id);

    if (result.success) {
      setRecords(records.filter(r => r.id !== id));
    } else {
      throw new Error(result.error || 'Failed to delete record');
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
        <PromptForm
          onSubmit={handleSubmitPrompt}
          isLoading={isPending}
          currentPrompt={currentPrompt?.content}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {currentPrompt && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Current Prompt:</h3>
          <p className="text-blue-800 dark:text-blue-300 whitespace-pre-wrap">{currentPrompt.content}</p>
        </div>
      )}

      <RecordsList
        records={records}
        onUpdate={handleUpdateRecord}
        onDelete={handleDeleteRecord}
      />
    </>
  );
}

