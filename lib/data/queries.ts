import { queries } from '@/lib/db/client';

export interface Record {
  id: number;
  title?: string | null;
  description: string;
}

export interface Prompt {
  id: number;
  content: string;
}

/**
 * Fetches all records from the database.
 * This function is designed to be called from Server Components.
 */
export async function getRecords(): Promise<Record[]> {
  try {
    const records = await queries.getAllRecords();
    return records || [];
  } catch (error) {
    console.error('Error fetching records:', error);
    return [];
  }
}

/**
 * Fetches the current (most recent) prompt from the database.
 * This function is designed to be called from Server Components.
 */
export async function getCurrentPrompt(): Promise<Prompt | null> {
  try {
    const prompts = await queries.getAllPrompts();
    
    if (prompts && prompts.length > 0) {
      return prompts[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return null;
  }
}

