import { PROVIDER_CONFIG, PROVIDERS } from '@/lib/provider'

export type Provider = (typeof PROVIDERS)[number]

export type ProviderWithKey = { provider: Provider; apiKey?: string }

export type Model =
  (typeof PROVIDER_CONFIG)[keyof typeof PROVIDER_CONFIG]['models'][number]
