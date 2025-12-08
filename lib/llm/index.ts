import { LLMProvider } from './provider';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';

export function getLLMProvider(): LLMProvider {
  const providerType = (process.env.LLM_PROVIDER || 'openai').toLowerCase();

  switch (providerType) {
    case 'anthropic': {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
      return new AnthropicProvider(apiKey);
    }
    case 'openai':
    default: {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }
      return new OpenAIProvider(apiKey);
    }
  }
}

