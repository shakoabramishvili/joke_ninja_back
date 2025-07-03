/**
 * OpenAI API integration module
 *
 * This module provides functionality to interact with OpenAI's API services
 * using the official OpenAI SDK.
 */

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';
/**
 * OpenAI API client class
 */
class OpenAIClient {
  private client: OpenAI;

  /**
   * Create a new OpenAI client instance
   * @param apiKey OpenAI API key
   * @param organization Optional organization ID
   */
  constructor(apiKey: string, organization?: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
      organization: organization,
    });
  }

  /**
   * Create a chat completion
   * @param model The model to use (e.g., "gpt-4o-mini", "gpt-4", "gpt-4o")
   * @param messages Array of messages in the conversation
   * @param options Additional options like temperature, max_tokens, etc.
   * @returns Promise with the chat completion response
   */
  async createChatCompletion(
    model: string,
    messages: Array<ChatCompletionMessageParam>,
    options: {
      temperature?: number;
      max_tokens?: number;
      store?: boolean;
      top_p?: number;
      frequency_penalty?: number;
      presence_penalty?: number;
    } = {},
  ) {
    try {
      const completion = await this.client.chat.completions.create({
        model,
        messages,
        store: options.store,
        temperature: options.temperature,
        max_tokens: options.max_tokens,
        top_p: options.top_p,
        frequency_penalty: options.frequency_penalty,
        presence_penalty: options.presence_penalty,
      });

      return completion;
    } catch (error) {
      // Type assertion for error
      const err = error as Error;
      throw new Error(`OpenAI API error: ${err.message}`);
    }
  }

  /**
   * Simple method to get a chat response
   * @param prompt User's input text
   * @param model OpenAI model to use (defaults to gpt-4o)
   * @param systemPrompt Optional system prompt to set context
   * @returns The assistant's response text
   */
  async chat(prompt: string, actor: string, model = 'gpt-4o-mini') {
    const messages: Array<ChatCompletionMessageParam> = [];

    messages.push({
      role: 'system',
      content: actor,
    });

    messages.push({
      role: 'user',
      content: ` Generate a short, dark-humored phrase for this situation: ${prompt}`,
    });

    const response = await this.createChatCompletion(model, messages, {
      temperature: 1,
    });

    return response.choices[0].message.content;
  }
}

export default OpenAIClient;

export const AIChat = new OpenAIClient(process.env.OPEN_AI_KEY);
