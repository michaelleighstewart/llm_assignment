import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the db client before importing routes
vi.mock('@/lib/db/client', () => {
  const mockDb = {
    delete: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  };
  
  return {
    db: mockDb,
    getTables: vi.fn().mockReturnValue({
      prompts: { id: 'prompts.id', content: 'prompts.content' },
      records: { id: 'records.id', promptId: 'records.promptId' },
    }),
  };
});

// Mock the LLM provider
vi.mock('@/lib/llm', () => ({
  getLLMProvider: vi.fn().mockReturnValue({
    generateResponse: vi.fn().mockResolvedValue({
      records: [
        { title: 'Test Title 1', description: 'Test description 1' },
        { title: 'Test Title 2', description: 'Test description 2' },
      ],
    }),
  }),
}));

describe('POST /api/prompts', () => {
  let POST: typeof import('@/app/api/prompts/route').POST;
  let mockDb: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Import the route handler
    const route = await import('@/app/api/prompts/route');
    POST = route.POST;
    
    // Get reference to mocked db
    const { db } = await import('@/lib/db/client');
    mockDb = db;
    
    // Setup default mock implementations
    mockDb.returning.mockResolvedValue([{ id: 1, content: 'Test prompt' }]);
    mockDb.from.mockReturnThis();
    mockDb.where.mockResolvedValue([
      { id: 1, promptId: 1, title: 'Test Title 1', description: 'Test description 1' },
      { id: 2, promptId: 1, title: 'Test Title 2', description: 'Test description 2' },
    ]);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should create a prompt and return records', async () => {
    const request = new NextRequest('http://localhost:3000/api/prompts', {
      method: 'POST',
      body: JSON.stringify({ content: 'Test prompt content' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('prompt');
    expect(data).toHaveProperty('records');
  });

  it('should return 400 for empty prompt content', async () => {
    const request = new NextRequest('http://localhost:3000/api/prompts', {
      method: 'POST',
      body: JSON.stringify({ content: '' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Invalid request');
  });

  it('should return 400 for missing content field', async () => {
    const request = new NextRequest('http://localhost:3000/api/prompts', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  it('should delete existing records before creating new ones', async () => {
    const request = new NextRequest('http://localhost:3000/api/prompts', {
      method: 'POST',
      body: JSON.stringify({ content: 'New prompt' }),
      headers: { 'Content-Type': 'application/json' },
    });

    await POST(request);

    // Verify delete was called for both tables
    expect(mockDb.delete).toHaveBeenCalledTimes(2);
  });
});

describe('GET /api/prompts', () => {
  let GET: typeof import('@/app/api/prompts/route').GET;
  let mockDb: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const route = await import('@/app/api/prompts/route');
    GET = route.GET;
    
    const { db } = await import('@/lib/db/client');
    mockDb = db;
    
    mockDb.from.mockResolvedValue([
      { id: 1, content: 'Test prompt', createdAt: new Date() },
    ]);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should return all prompts', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('prompts');
    expect(Array.isArray(data.prompts)).toBe(true);
  });
});

