import { NextRequest, NextResponse } from 'next/server';
import { db, getTables } from '@/lib/db/client';
import { getLLMProvider } from '@/lib/llm';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const promptSchema = z.object({
  content: z.string().min(1, 'Prompt cannot be empty'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = promptSchema.parse(body);

    // Delete all existing prompts and records (requirement: delete previous records)
    const tables = getTables();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db.delete as any)(tables.records);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db.delete as any)(tables.prompts);

    // Create new prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [prompt] = await (db.insert as any)(tables.prompts).values({ content }).returning();

    // Get LLM response
    const llmProvider = getLLMProvider();
    const llmResponse = await llmProvider.generateResponse(content);

    // Insert records from LLM response
    const recordsToInsert = llmResponse.records.map((record) => ({
      promptId: prompt.id,
      title: record.title || null,
      description: record.description,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db.insert as any)(tables.records).values(recordsToInsert);

    // Fetch all records to return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records = await (db.select as any)().from(tables.records).where(eq(tables.records.promptId, prompt.id));

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
    const tables = getTables();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prompts = await (db.select as any)().from(tables.prompts);
    
    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}

