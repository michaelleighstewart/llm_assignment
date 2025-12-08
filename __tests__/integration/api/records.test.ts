import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the db client before importing routes
vi.mock('@/lib/db/client', () => {
  const mockDb = {
    delete: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  };
  
  return {
    db: mockDb,
    getTables: vi.fn().mockReturnValue({
      prompts: { id: 'prompts.id', content: 'prompts.content' },
      records: { id: 'records.id', promptId: 'records.promptId', title: 'records.title', description: 'records.description' },
    }),
  };
});

describe('GET /api/records', () => {
  let GET: typeof import('@/app/api/records/route').GET;
  let mockDb: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const route = await import('@/app/api/records/route');
    GET = route.GET;
    
    const { db } = await import('@/lib/db/client');
    mockDb = db;
    
    mockDb.from.mockResolvedValue([
      { id: 1, promptId: 1, title: 'Record 1', description: 'Description 1' },
      { id: 2, promptId: 1, title: 'Record 2', description: 'Description 2' },
    ]);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should return all records', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('records');
    expect(Array.isArray(data.records)).toBe(true);
    expect(data.records).toHaveLength(2);
  });

  it('should return empty array when no records exist', async () => {
    mockDb.from.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.records).toHaveLength(0);
  });
});

describe('PUT /api/records/[id]', () => {
  let PUT: typeof import('@/app/api/records/[id]/route').PUT;
  let mockDb: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const route = await import('@/app/api/records/[id]/route');
    PUT = route.PUT;
    
    const { db } = await import('@/lib/db/client');
    mockDb = db;
    
    mockDb.returning.mockResolvedValue([
      { id: 1, promptId: 1, title: 'Updated Title', description: 'Updated description' },
    ]);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should update a record successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/records/1', {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Updated Title',
        description: 'Updated description',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request, { params: Promise.resolve({ id: '1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('record');
    expect(data.record.title).toBe('Updated Title');
  });

  it('should return 400 for empty description', async () => {
    const request = new NextRequest('http://localhost:3000/api/records/1', {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Title',
        description: '',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request, { params: Promise.resolve({ id: '1' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Invalid request');
  });

  it('should return 404 when record not found', async () => {
    mockDb.returning.mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/records/999', {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Title',
        description: 'Description',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request, { params: Promise.resolve({ id: '999' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error', 'Record not found');
  });

  it('should allow update without title', async () => {
    mockDb.returning.mockResolvedValue([
      { id: 1, promptId: 1, title: null, description: 'Description only' },
    ]);

    const request = new NextRequest('http://localhost:3000/api/records/1', {
      method: 'PUT',
      body: JSON.stringify({
        description: 'Description only',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request, { params: Promise.resolve({ id: '1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.record.title).toBeNull();
  });
});

describe('DELETE /api/records/[id]', () => {
  let DELETE: typeof import('@/app/api/records/[id]/route').DELETE;
  let mockDb: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const route = await import('@/app/api/records/[id]/route');
    DELETE = route.DELETE;
    
    const { db } = await import('@/lib/db/client');
    mockDb = db;
    
    mockDb.where.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should delete a record successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/records/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: '1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('success', true);
  });

  it('should call delete with correct ID', async () => {
    const request = new NextRequest('http://localhost:3000/api/records/42', {
      method: 'DELETE',
    });

    await DELETE(request, { params: Promise.resolve({ id: '42' }) });

    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });
});

