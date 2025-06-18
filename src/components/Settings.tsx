import React from 'react'

import Input from '@/components/Input'
import Select from '@/components/Select'
import {
  DEFAULT_PROVIDER,
  DEFAULT_MODEL,
  models,
  providers,
  providerConfig,
  providerDisplayNames,
  type Model,
  type Provider,
} from '@/lib/providers'
import { useChatStore } from '@/store/useChatStore'

export default function Settings() {
  const { apiKeys, model, provider, setApiKeys, setModel, setProvider } =
    useChatStore()

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = (e?.target?.value ?? DEFAULT_PROVIDER) as Provider
    setProvider(providers.includes(value) ? value : DEFAULT_PROVIDER)
    setModel(providerConfig[value]?.models?.[0])
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const providerModels = [...models[provider]]
    const value = (e?.target?.value ?? DEFAULT_MODEL) as Model
    setModel(providerModels.includes(value) ? value : DEFAULT_MODEL)
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

  return (
    <React.Fragment>
      <div className="text-neutral-0 flex gap-4">
        <Select
          id="choose-provider"
          label="Provider"
          placeholder="Choose Provider"
          value={provider}
          options={providers?.map((provider) => ({
            label:
              providerDisplayNames.find(
                (providerDisplayName) => providerDisplayName.key === provider
              )?.displayName ?? '',
            value: provider,
          }))}
          onChange={handleProviderChange}
        />
        <Select
          id="choose-model"
          label="Model"
          placeholder="Choose Model"
          value={model}
          options={models?.[provider]?.map((model) => ({
            label: model,
            value: model,
          }))}
          onChange={handleModelChange}
        />
      </div>
      <hr className="my-4 border-current text-gray-400" />
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Api Keys</h2>
        <p>
          ⚠️ Do not use production API keys in these fields. They are stored in
          sessionStorage and are not encrypted or protected. Remove them when
          you are done or clear sessionStorage! ⚠️
        </p>
        {providers?.length
          ? providers?.map((provider) => (
              <div key={provider}>
                <Input
                  id={`${provider}-api-key`}
                  label={`${providerDisplayNames?.find((providerDisplayName) => providerDisplayName.key === provider)?.displayName} API Key`}
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
    </React.Fragment>
  )
}
