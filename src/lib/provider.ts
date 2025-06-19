import type { Provider } from '@/types/provider'

export const PROVIDERS = ['anthropic', 'openai', 'deepseek'] as const

export const PROVIDER_CONFIG: Record<
  Provider,
  { displayName: string; models: readonly string[] }
> = {
  anthropic: {
    displayName: 'Anthropic',
    models: ['claude-3-5-haiku-20241022'] as const,
  },
  openai: {
    displayName: 'OpenAI',
    models: ['gpt-4o'] as const,
  },
  deepseek: {
    displayName: 'DeepSeek',
    models: ['deepseek-chat'] as const,
  },
} as const

export const MODELS = Object.fromEntries(
  Object.entries(PROVIDER_CONFIG).map(([key, { models }]) => [key, models])
)

export const DEFAULT_PROVIDER = 'openai'
export const DEFAULT_MODEL = 'gpt-4o'

export function getProviderDisplayName(provider: Provider) {
  return PROVIDER_CONFIG[provider]?.displayName
}
