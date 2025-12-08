import { NextResponse } from 'next/server';
import { queries } from '@/lib/db/client';

export async function GET() {
  try {
    const records = await queries.getAllRecords();
    
    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    );
  }
}
