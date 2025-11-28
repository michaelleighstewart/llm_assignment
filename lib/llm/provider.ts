export interface LLMProvider {
  generateResponse(prompt: string): Promise<LLMResponse>;
}

export interface LLMResponse {
  records: Array<{
    title?: string;
    description: string;
  }>;
}

