export const providerConfig = {
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

// Provider keys based on providerConfig
export type Provider = keyof typeof providerConfig

// List of provider keys

export const providers = Object.keys(providerConfig) as Array<
  keyof typeof providerConfig
>

// Map each provider to its array of models
export const models = Object.fromEntries(
  Object.entries(providerConfig).map(([key, { models }]) => [key, models])
)

// Display names for UI
export const providerDisplayNames = providers.map((key) => ({
  key,
  displayName: providerConfig[key].displayName,
}))

export type ProviderWithKey = { provider: Provider; apiKey?: string }

export type Model =
  (typeof providerConfig)[keyof typeof providerConfig]['models'][number]

export const DEFAULT_PROVIDER = 'openai'
export const DEFAULT_MODEL = 'gpt-4o'
