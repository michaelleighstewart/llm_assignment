import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock environment variables
vi.stubEnv('OPENAI_API_KEY', 'test-api-key');
vi.stubEnv('NODE_ENV', 'test');

