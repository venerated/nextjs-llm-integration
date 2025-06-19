import { createProviderRegistry } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'

import type { Provider } from '@/types/provider'

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
