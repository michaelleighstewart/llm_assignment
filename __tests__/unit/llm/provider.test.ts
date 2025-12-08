import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLLMProvider } from '@/lib/llm/index';

// Mock the OpenAI provider with a proper class
vi.mock('@/lib/llm/openai', () => {
  return {
    OpenAIProvider: class MockOpenAIProvider {
      apiKey: string;
      constructor(apiKey: string) {
        this.apiKey = apiKey;
      }
      generateResponse = vi.fn();
    },
  };
});

describe('getLLMProvider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw error when OPENAI_API_KEY is not set', () => {
    delete process.env.OPENAI_API_KEY;

    expect(() => getLLMProvider()).toThrow(
      'OPENAI_API_KEY environment variable is not set'
    );
  });

  it('should return OpenAIProvider when API key is set', () => {
    process.env.OPENAI_API_KEY = 'test-api-key';
    process.env.LLM_PROVIDER = 'openai';

    const provider = getLLMProvider();

    expect(provider).toBeDefined();
    expect(provider).toHaveProperty('generateResponse');
  });

  it('should default to OpenAI provider when LLM_PROVIDER is not set', () => {
    process.env.OPENAI_API_KEY = 'test-api-key';
    delete process.env.LLM_PROVIDER;

    const provider = getLLMProvider();

    expect(provider).toBeDefined();
  });

  it('should throw error for unsupported provider', () => {
    process.env.OPENAI_API_KEY = 'test-api-key';
    process.env.LLM_PROVIDER = 'unsupported-provider';

    expect(() => getLLMProvider()).toThrow(
      'Unsupported LLM provider: unsupported-provider'
    );
  });
});

