/**
 * Groq AI Provider
 * 
 * Primary AI provider implementation using Groq's API with Llama models.
 * Replaces the duplicated GroqService / NirvahaService classes.
 */

import { ChatMessage, ModelConfig } from '../types';
import { IAIProvider } from './AIProvider';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

const DEFAULT_CONFIG: Required<ModelConfig> = {
  temperature: 0.72,
  topP: 0.95,
  maxTokens: 600,
  model: DEFAULT_MODEL,
};

export class GroqProvider implements IAIProvider {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  }

  getName(): string {
    return 'Groq';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateResponse(
    messages: ChatMessage[],
    config?: ModelConfig,
  ): Promise<string> {
    if (!this.apiKey) {
      console.warn('[GroqProvider] API key not configured. Set EXPO_PUBLIC_GROQ_API_KEY.');
      throw new Error('Groq API key is missing.');
    }

    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: mergedConfig.model,
          messages,
          temperature: mergedConfig.temperature,
          top_p: mergedConfig.topP,
          max_tokens: mergedConfig.maxTokens,
        }),
      });

      const responseText = await response.text();
      let data: any;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonErr) {
        console.error('[GroqProvider] Failed to parse response as JSON. Status:', response.status, 'Response:', responseText);
        throw new Error(`Invalid JSON response from Groq API (status ${response.status})`);
      }

      if (!response.ok) {
        console.error('[GroqProvider] API error:', data);
        throw new Error(data.error?.message || 'Groq API request failed');
      }

      const replyText = data.choices?.[0]?.message?.content?.trim();

      if (!replyText) {
        throw new Error('Empty response from Groq API');
      }

      return replyText;
    } catch (error) {
      console.error('[GroqProvider] Error:', error);
      throw error;
    }
  }
}
