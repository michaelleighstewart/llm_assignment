import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { LLMProvider, LLMResponse } from './provider';

// Define the Zod schema for structured outputs
const RecordSchema = z.object({
  title: z.string().nullable().describe('A short, clear heading for the item'),
  description: z.string().describe('Detailed explanation or content of the item'),
});

const RecordsResponseSchema = z.object({
  records: z.array(RecordSchema).describe('Array of structured records from the response'),
});

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(prompt: string): Promise<LLMResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides detailed, structured responses. Break down your response into multiple clear, actionable items when appropriate.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: zodResponseFormat(RecordsResponseSchema, 'records_response'),
      });

      const content = completion.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Parse and validate the JSON response
      const parsedResponse = JSON.parse(content);
      const validatedResponse = RecordsResponseSchema.parse(parsedResponse);

      // Transform null titles to undefined to match LLMResponse interface
      return {
        records: validatedResponse.records.map(record => ({
          title: record.title ?? undefined,
          description: record.description,
        })),
      };
    } catch (error) {
      console.error('Error generating structured response:', error);
      throw new Error('Failed to generate response from OpenAI');
    }
  }
}

