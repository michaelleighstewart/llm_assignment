'use server';

import { queries } from '@/lib/db/client';
import { getLLMProvider } from '@/lib/llm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const promptSchema = z.object({
  content: z.string().min(1, 'Prompt cannot be empty'),
});

export interface SubmitPromptResult {
  success: boolean;
  error?: string;
  prompt?: {
    id: number;
    content: string;
  };
  records?: Array<{
    id: number;
    title?: string | null;
    description: string;
  }>;
}

export async function submitPrompt(content: string): Promise<SubmitPromptResult> {
  try {
    const validated = promptSchema.parse({ content });

    // Delete all existing prompts and records (requirement: delete previous records)
    await queries.deleteAllRecords();
    await queries.deleteAllPrompts();

    // Create new prompt
    const [prompt] = await queries.insertPrompt(content);

    // Get LLM response
    const llmProvider = getLLMProvider();
    const llmResponse = await llmProvider.generateResponse(validated.content);

    // Insert records from LLM response
    const recordsToInsert = llmResponse.records.map((record) => ({
      promptId: prompt.id,
      title: record.title || null,
      description: record.description,
    }));

    await queries.insertRecords(recordsToInsert);

    // Fetch all records to return
    const records = await queries.getRecordsByPromptId(prompt.id);

    revalidatePath('/');

    return {
      success: true,
      prompt,
      records,
    };
  } catch (error) {
    console.error('Error processing prompt:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Invalid prompt',
      };
    }

    return {
      success: false,
      error: 'Failed to process prompt',
    };
  }
}

export async function GET() {
  try {
    const prompts = await queries.getAllPrompts();
    
    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
