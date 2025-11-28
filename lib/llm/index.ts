import { LLMProvider } from './provider';
import { OpenAIProvider } from './openai';

export function getLLMProvider(): LLMProvider {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  // Factory pattern - can easily add more providers here
  const providerType = process.env.LLM_PROVIDER || 'openai';
  
  switch (providerType) {
    case 'openai':
      return new OpenAIProvider(apiKey);
    default:
      throw new Error(`Unsupported LLM provider: ${providerType}`);
  }
}

