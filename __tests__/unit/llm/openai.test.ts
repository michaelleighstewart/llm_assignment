import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIProvider } from '@/lib/llm/openai';

// Create a mock for the create function that we can control
const mockCreate = vi.fn();

// Mock the OpenAI module with a proper class
vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat = {
        completions: {
          create: mockCreate,
        },
      };
      constructor() {}
    },
  };
});

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new OpenAIProvider('test-api-key');
  });

  describe('generateResponse', () => {
    it('should return parsed records from OpenAI response', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                records: [
                  { title: 'Test Title', description: 'Test description' },
                  { title: null, description: 'No title description' },
                ],
              }),
            },
          },
        ],
      };

      mockCreate.mockResolvedValueOnce(mockResponse);

      const result = await provider.generateResponse('Test prompt');

      expect(result.records).toHaveLength(2);
      expect(result.records[0]).toEqual({
        title: 'Test Title',
        description: 'Test description',
      });
      expect(result.records[1]).toEqual({
        title: undefined,
        description: 'No title description',
      });
    });

    it('should throw error when no content is received', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      };

      mockCreate.mockResolvedValueOnce(mockResponse);

      await expect(provider.generateResponse('Test prompt')).rejects.toThrow(
        'Failed to generate response from OpenAI'
      );
    });

    it('should throw error when response is invalid JSON', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'not valid json',
            },
          },
        ],
      };

      mockCreate.mockResolvedValueOnce(mockResponse);

      await expect(provider.generateResponse('Test prompt')).rejects.toThrow(
        'Failed to generate response from OpenAI'
      );
    });

    it('should throw error when response does not match schema', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                invalid: 'schema',
              }),
            },
          },
        ],
      };

      mockCreate.mockResolvedValueOnce(mockResponse);

      await expect(provider.generateResponse('Test prompt')).rejects.toThrow(
        'Failed to generate response from OpenAI'
      );
    });

    it('should handle empty records array', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                records: [],
              }),
            },
          },
        ],
      };

      mockCreate.mockResolvedValueOnce(mockResponse);

      const result = await provider.generateResponse('Test prompt');

      expect(result.records).toHaveLength(0);
    });

    it('should call OpenAI with correct parameters', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                records: [{ title: 'Test', description: 'Test desc' }],
              }),
            },
          },
        ],
      };

      mockCreate.mockResolvedValueOnce(mockResponse);

      await provider.generateResponse('My test prompt');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o-mini',
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({ role: 'user', content: 'My test prompt' }),
          ]),
          temperature: 0.7,
        })
      );
    });
  });
});

