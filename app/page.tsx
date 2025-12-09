import { HomeClient } from '@/components/HomeClient';
import { getRecords, getCurrentPrompt } from '@/lib/data/queries';

export default async function Home() {
  // Fetch initial data on the server
  const [records, currentPrompt] = await Promise.all([
    getRecords(),
    getCurrentPrompt(),
  ]);

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

        <HomeClient
          initialRecords={records}
          initialPrompt={currentPrompt}
        />
      </div>
    </main>
  );
}
