'use server';

import { db, getTables } from '@/lib/db/client';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateRecordSchema = z.object({
  title: z.string().optional(),
  description: z.string().min(1, 'Description cannot be empty'),
});

export interface UpdateRecordResult {
  success: boolean;
  error?: string;
  record?: {
    id: number;
    title?: string | null;
    description: string;
  };
}

export interface DeleteRecordResult {
  success: boolean;
  error?: string;
}

/**
 * Updates a record with the provided data.
 */
export async function updateRecord(
  id: number,
  data: { title?: string; description: string }
): Promise<UpdateRecordResult> {
  try {
    const validated = updateRecordSchema.parse(data);

    const tables = getTables();
    const [updatedRecord] = await (db
      .update as any)(tables.records) // eslint-disable-line @typescript-eslint/no-explicit-any
      .set({
        title: validated.title ?? null,
        description: validated.description,
      })
      .where(eq(tables.records.id, id))
      .returning();

    if (!updatedRecord) {
      return {
        success: false,
        error: 'Record not found',
      };
    }

    revalidatePath('/');

    return {
      success: true,
      record: updatedRecord,
    };
  } catch (error) {
    console.error('Error updating record:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Invalid data',
      };
    }

    return {
      success: false,
      error: 'Failed to update record',
    };
  }
}

/**
 * Deletes a record by ID.
 */
export async function deleteRecord(id: number): Promise<DeleteRecordResult> {
  try {
    const tables = getTables();

    await (db
      .delete as any)(tables.records) // eslint-disable-line @typescript-eslint/no-explicit-any
      .where(eq(tables.records.id, id));

    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting record:', error);
    return {
      success: false,
      error: 'Failed to delete record',
    };
  }
}

