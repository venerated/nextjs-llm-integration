import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'
import { createProviderRegistry } from 'ai'
import { type Provider } from '@/lib/providers'

export default function createRegistry(
  apiKey: Partial<Record<Provider, string>>
) {
  return createProviderRegistry({
    // register provider with prefix and default setup:
    anthropic: createAnthropic({
      apiKey: apiKey.anthropic ?? '',
    }),

    deepseek: createDeepSeek({
      apiKey: apiKey.deepseek ?? '',
    }),

    // register provider with prefix and custom setup:
    openai: createOpenAI({
      apiKey: apiKey.openai ?? '',
    }),
  })
}
