import React from 'react'

import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import {
  DEFAULT_PROVIDER,
  DEFAULT_MODEL,
  MODELS,
  PROVIDERS,
  PROVIDER_CONFIG,
  getProviderDisplayName,
} from '@/lib/provider'
import { useSettingsStore } from '@/store/useSettingsStore'

import type { Model, Provider } from '@/types/provider'

export default function Settings({ onClearChat }: { onClearChat: () => void }) {
  const { apiKeys, model, provider, setApiKeys, setModel, setProvider } =
    useSettingsStore()

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = (e?.target?.value ?? DEFAULT_PROVIDER) as Provider
    setProvider(PROVIDERS.includes(value) ? value : DEFAULT_PROVIDER)
    setModel(PROVIDER_CONFIG[value]?.models?.[0])
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = (e?.target?.value ?? DEFAULT_MODEL) as Model
    setModel([...MODELS[provider]].includes(value) ? value : DEFAULT_MODEL)
  }

  const handleUpdateApiKeys = (provider: Provider, apiKey: string) => {
    const currentKeyIndex = apiKeys.findIndex(
      (key) => key.provider === provider
    )
    const keys = [...apiKeys]
    if (keys?.[currentKeyIndex]) {
      keys[currentKeyIndex].apiKey = apiKey
    } else {
      keys.push({ provider, apiKey })
    }
    setApiKeys(keys)
  }

  const handleClearChat = () => {
    const confirmation = window?.confirm(
      'Are you sure you want to clear chat messages?'
    )
    if (confirmation) onClearChat()
  }

  return (
    <React.Fragment>
      <div className="text-neutral-0 flex gap-4">
        <Select
          id="choose-provider"
          label="Provider"
          placeholder="Choose Provider"
          value={provider}
          options={PROVIDERS?.map((provider) => ({
            label: getProviderDisplayName(provider) ?? '',
            value: provider,
          }))}
          onChange={handleProviderChange}
        />
        <Select
          id="choose-model"
          label="Model"
          placeholder="Choose Model"
          value={model}
          options={MODELS?.[provider]?.map((model) => ({
            label: model,
            value: model,
          }))}
          onChange={handleModelChange}
        />
      </div>
      <hr className="my-4 border-current text-gray-400" />
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">API Keys</h2>
        <p>
          ⚠️ Do not use production API keys in these fields. They are stored in
          sessionStorage and are not encrypted or protected. Remove them when
          you are done or clear sessionStorage! ⚠️
        </p>
        {PROVIDERS?.length
          ? PROVIDERS.map((provider) => (
              <div key={provider}>
                <Input
                  id={`${provider}-api-key`}
                  label={`${getProviderDisplayName(provider)} API Key`}
                  value={
                    apiKeys?.find?.((apiKey) => apiKey.provider === provider)
                      ?.apiKey ?? ''
                  }
                  onChange={(e) =>
                    handleUpdateApiKeys(provider, e?.target?.value)
                  }
                />
              </div>
            ))
          : null}
      </div>
      <hr className="my-4 border-current text-gray-400" />
      <div className="flex flex-col items-start gap-4">
        <h2 className="text-2xl font-bold">Data</h2>
        <Button variant="warning" onClick={handleClearChat}>
          Clear Chat Messages
        </Button>
      </div>
    </React.Fragment>
  )
}
