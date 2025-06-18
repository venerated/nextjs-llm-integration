import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'
import { createProviderRegistry } from 'ai'
import { type Provider } from '@/lib/providers'

export default function createRegistry(
  apiKey: Partial<Record<Provider, string>>
) {
  return createProviderRegistry({
    anthropic: createAnthropic({
      apiKey: apiKey.anthropic ?? '',
    }),

    deepseek: createDeepSeek({
      apiKey: apiKey.deepseek ?? '',
    }),

    openai: createOpenAI({
      apiKey: apiKey.openai ?? '',
    }),
  })
}
