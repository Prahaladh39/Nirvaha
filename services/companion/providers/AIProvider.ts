/**
 * AI Provider Interface
 * 
 * Abstract interface for LLM providers. Any new provider (Gemini, OpenAI, etc.)
 * implements this interface and plugs into the system with zero changes elsewhere.
 */

import { ChatMessage, ModelConfig } from '../types';

export interface IAIProvider {
  /**
   * Generate a response from the AI model.
   * @param messages - Array of chat messages (system + history + user)
   * @param config - Optional model configuration overrides
   * @returns The generated text response
   */
  generateResponse(messages: ChatMessage[], config?: ModelConfig): Promise<string>;

  /**
   * Get the provider's display name.
   */
  getName(): string;

  /**
   * Check if the provider is properly configured and ready.
   */
  isAvailable(): boolean;
}
