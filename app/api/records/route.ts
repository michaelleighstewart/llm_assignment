import { NextResponse } from 'next/server';
import { db, getTables } from '@/lib/db/client';

export async function GET() {
  try {
    const tables = getTables();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records = await (db.select as any)().from(tables.records);
    
    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    );
  }
}

