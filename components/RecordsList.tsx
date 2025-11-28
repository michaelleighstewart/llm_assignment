'use client';

import { RecordCard } from './RecordCard';

interface Record {
  id: number;
  title?: string | null;
  description: string;
}

interface RecordsListProps {
  records: Record[];
  onUpdate: (id: number, data: { title?: string; description: string }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function RecordsList({ records, onUpdate, onDelete }: RecordsListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No records yet. Submit a prompt to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Generated Records</h2>
      <div className="grid gap-4">
        {records.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

