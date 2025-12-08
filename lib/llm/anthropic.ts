import Anthropic from '@anthropic-ai/sdk';
import type { ToolUseBlock } from '@anthropic-ai/sdk/resources/messages';
import { z } from 'zod';
import type { LLMProvider, LLMResponse } from './provider';

/**
 * AnthropicProvider
 * Uses Anthropic tool-use to return structured records:
 * { records: [{ title?: string; description: string }] }
 */
export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generateResponse(prompt: string): Promise<LLMResponse> {
    // Define the tool schema that matches our expected output shape
    const tools: Anthropic.Tool[] = [
      {
        name: 'create_records',
        description: 'Return structured records from the response',
        input_schema: {
          type: 'object',
          properties: {
            records: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string', nullable: true },
                  description: { type: 'string' },
                },
                required: ['description'],
              },
            },
          },
          required: ['records'],
        },
      },
    ];

    const message = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      tools,
      tool_choice: { type: 'tool', name: 'create_records' },
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract the tool_use result
    const toolUse = message.content.find(
      (block): block is ToolUseBlock =>
        block.type === 'tool_use' && block.name === 'create_records'
    );

    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error('No structured tool output from Anthropic');
    }

    // Validate and narrow the tool output shape to avoid unknown typing
    const ToolOutputSchema = z.object({
      records: z.array(
        z.object({
          title: z.string().nullable().optional(),
          description: z.string(),
        })
      ),
    });

    const parsed = ToolOutputSchema.parse(toolUse.input);

    return {
      records: parsed.records.map((r) => ({
        title: r.title ?? undefined,
        description: r.description,
      })),
    };
  }
}

