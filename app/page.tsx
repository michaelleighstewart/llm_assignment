'use client';

import { useState, useEffect } from 'react';
import { PromptForm } from '@/components/PromptForm';
import { RecordsList } from '@/components/RecordsList';

interface Record {
  id: number;
  title?: string | null;
  description: string;
}

interface Prompt {
  id: number;
  content: string;
}

export default function Home() {
  const [records, setRecords] = useState<Record[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing records on mount
  useEffect(() => {
    fetchRecords();
    fetchPrompts();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/records');
      const data = await response.json();
      setRecords(data.records || []);
    } catch (err) {
      console.error('Error fetching records:', err);
    }
  };

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      if (data.prompts && data.prompts.length > 0) {
        setCurrentPrompt(data.prompts[0]);
      }
    } catch (err) {
      console.error('Error fetching prompts:', err);
    }
  };

  const handleSubmitPrompt = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to process prompt');
      }

      const data = await response.json();
      setCurrentPrompt(data.prompt);
      setRecords(data.records || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error submitting prompt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRecord = async (id: number, data: { title?: string; description: string }) => {
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update record');
      }

      const result = await response.json();
      setRecords(records.map(r => r.id === id ? result.record : r));
    } catch (err) {
      console.error('Error updating record:', err);
      alert('Failed to update record');
    }
  };

  const handleDeleteRecord = async (id: number) => {
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Failed to delete record');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            LLM Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Submit prompts and manage AI-generated responses
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <PromptForm
            onSubmit={handleSubmitPrompt}
            isLoading={isLoading}
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
      </div>
    </main>
  );
}
