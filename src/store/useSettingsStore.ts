'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { DEFAULT_MODEL, DEFAULT_PROVIDER } from '@/lib/provider'

import type { Model, Provider, ProviderWithKey } from '@/types/provider'

type State = {
  apiKeys: ProviderWithKey[]
  model: Model
  provider: Provider
}

type Actions = {
  setApiKeys: (keys: ProviderWithKey[]) => void
  setModel: (model: Model) => void
  setProvider: (provider: Provider) => void
}

export const useSettingsStore = create<State & Actions>()(
  persist(
    (set) => ({
      apiKeys: [],
      provider: DEFAULT_PROVIDER,
      model: DEFAULT_MODEL,
      setApiKeys: (apiKeys) => set({ apiKeys }),
      setModel: (model) => set({ model }),
      setProvider: (provider) => set({ provider }),
    }),
    { name: 'settings', storage: createJSONStorage(() => sessionStorage) }
  )
)
