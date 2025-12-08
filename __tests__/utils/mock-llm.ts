import type { LLMProvider, LLMResponse } from '@/lib/llm/provider';

/**
 * Mock LLM Provider for testing
 * Returns predictable responses without making API calls
 */
export class MockLLMProvider implements LLMProvider {
  private mockResponse: LLMResponse;

  constructor(mockResponse?: LLMResponse) {
    this.mockResponse = mockResponse || {
      records: [
        {
          title: 'Test Record 1',
          description: 'This is a test description for record 1',
        },
        {
          title: 'Test Record 2',
          description: 'This is a test description for record 2',
        },
        {
          title: 'Test Record 3',
          description: 'This is a test description for record 3',
        },
      ],
    };
  }

  async generateResponse(prompt: string): Promise<LLMResponse> {
    // Simulate some async delay
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // Return mock response
    return this.mockResponse;
  }

  /**
   * Set a custom mock response for specific test cases
   */
  setMockResponse(response: LLMResponse): void {
    this.mockResponse = response;
  }
}

/**
 * Create a mock LLM response for testing
 */
export function createMockLLMResponse(count: number = 3): LLMResponse {
  return {
    records: Array.from({ length: count }, (_, i) => ({
      title: `Mock Title ${i + 1}`,
      description: `Mock description for item ${i + 1}. This contains test content.`,
    })),
  };
}

/**
 * Mock response simulating a tax advice prompt
 */
export const mockTaxAdviceResponse: LLMResponse = {
  records: [
    {
      title: 'Maximize Superannuation Contributions',
      description: 'Consider salary sacrificing up to the concessional cap of $27,500 per year.',
    },
    {
      title: 'Claim Work-Related Deductions',
      description: 'Ensure you claim all eligible work-related expenses including home office costs.',
    },
    {
      title: 'Review Investment Structure',
      description: 'Consider holding investments in the lower-earning partner\'s name for tax efficiency.',
    },
  ],
};

