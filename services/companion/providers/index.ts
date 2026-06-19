/**
 * AI Provider Factory
 * 
 * Returns the configured AI provider instance.
 * To add a new provider: implement IAIProvider and add a case here.
 */

import { IAIProvider } from './AIProvider';
import { GroqProvider } from './GroqProvider';

export type ProviderName = 'groq' | 'gemini' | 'openai';

let cachedProvider: IAIProvider | null = null;
let cachedProviderName: ProviderName | null = null;

/**
 * Get an AI provider instance. Defaults to Groq.
 * Caches the provider so subsequent calls reuse the same instance.
 */
export function getAIProvider(providerName: ProviderName = 'groq'): IAIProvider {
  // Return cached instance if same provider requested
  if (cachedProvider && cachedProviderName === providerName) {
    return cachedProvider;
  }

  switch (providerName) {
    case 'groq':
      cachedProvider = new GroqProvider();
      break;
    // Future providers:
    // case 'gemini':
    //   cachedProvider = new GeminiProvider();
    //   break;
    // case 'openai':
    //   cachedProvider = new OpenAIProvider();
    //   break;
    default:
      console.warn(`[AIProvider] Unknown provider "${providerName}", falling back to Groq.`);
      cachedProvider = new GroqProvider();
  }

  cachedProviderName = providerName;
  return cachedProvider;
}

export { IAIProvider } from './AIProvider';
