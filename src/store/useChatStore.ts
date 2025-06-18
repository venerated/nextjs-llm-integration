'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  DEFAULT_MODEL,
  DEFAULT_PROVIDER,
  Model,
  Provider,
  ProviderWithKey,
} from '@/lib/providers'

import { type AnnotatedMessage } from '@/types/message'

type State = {
  apiKeys: ProviderWithKey[]
  messages: AnnotatedMessage[]
  model: Model
  provider: Provider
}

type Actions = {
  setApiKeys: (keys: ProviderWithKey[]) => void
  setMessages: (messages: AnnotatedMessage[]) => void
  setModel: (model: Model) => void
  setProvider: (provider: Provider) => void
}

export const useChatStore = create<State & Actions>()(
  persist(
    (set) => ({
      apiKeys: [],
      messages: [],
      provider: DEFAULT_PROVIDER,
      model: DEFAULT_MODEL,
      setMessages: (messages) => set({ messages }),
      setApiKeys: (apiKeys) => set({ apiKeys }),
      setModel: (model) => set({ model }),
      setProvider: (provider) => set({ provider }),
    }),
    { name: 'chat', storage: createJSONStorage(() => sessionStorage) }
  )
)
