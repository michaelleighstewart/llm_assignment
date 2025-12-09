import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db/client';
import { getLLMProvider } from '@/lib/llm';
import { z } from 'zod';

const promptSchema = z.object({
  content: z.string().min(1, 'Prompt cannot be empty'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = promptSchema.parse(body);

    // Delete all existing prompts and records (requirement: delete previous records)
    await queries.deleteAllRecords();
    await queries.deleteAllPrompts();

    // Create new prompt
    const [prompt] = await queries.insertPrompt(content);

    // Get LLM response
    const llmProvider = getLLMProvider();
    const llmResponse = await llmProvider.generateResponse(content);

    // Insert records from LLM response
    const recordsToInsert = llmResponse.records.map((record) => ({
      promptId: prompt.id,
      title: record.title || null,
      description: record.description,
    }));

    await queries.insertRecords(recordsToInsert);

    // Fetch all records to return
    const records = await queries.getRecordsByPromptId(prompt.id);

    return NextResponse.json({
      prompt,
      records,
    });
  } catch (error) {
    console.error('Error processing prompt:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process prompt' },
      { status: 500 }
    );
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
