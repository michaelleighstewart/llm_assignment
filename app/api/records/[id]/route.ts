import { NextRequest, NextResponse } from 'next/server';
import { db, getTables } from '@/lib/db/client';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const updateRecordSchema = z.object({
  title: z.string().optional(),
  description: z.string().min(1, 'Description cannot be empty'),
});

/**
 * PUT /api/records/[id]
 * 
 * Updates a record with the provided data.
 * 
 * Schema Design:
 * - `title`: Optional (can be omitted or provided)
 * - `description`: Required (must be provided)
 * 
 * Usage Pattern:
 * The frontend always sends both fields when updating, making this effectively
 * a full update despite the schema allowing partial updates. This design provides
 * API flexibility while maintaining consistent usage patterns.
 * 
 * Note: While the API accepts partial updates (title is optional), the current
 * frontend implementation always provides both fields. If title is not provided,
 * it will be set to null.
 * 
 * @param id - Record ID from URL parameter
 * @param body - JSON body with title (optional) and description (required)
 * @returns Updated record or error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateRecordSchema.parse(body);

    const tables = getTables();
    const [updatedRecord] = await (db
      .update as any)(tables.records) // eslint-disable-line @typescript-eslint/no-explicit-any
      .set({
        title: data.title ?? null,  // Use ?? to preserve empty strings
        description: data.description,
      })
      .where(eq(tables.records.id, parseInt(id)))
      .returning();

    if (!updatedRecord) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ record: updatedRecord });
  } catch (error) {
    console.error('Error updating record:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update record' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/records/[id]
 * 
 * Deletes a record by ID.
 * 
 * @param id - Record ID from URL parameter
 * @returns Success confirmation or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tables = getTables();
    
    await (db
      .delete as any)(tables.records) // eslint-disable-line @typescript-eslint/no-explicit-any
      .where(eq(tables.records.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting record:', error);
    return NextResponse.json(
      { error: 'Failed to delete record' },
      { status: 500 }
    );
  }
}

