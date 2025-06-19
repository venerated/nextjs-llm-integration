'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { AnnotatedMessage } from '@/types/message'

type State = {
  messages: AnnotatedMessage[]
}

type Actions = {
  setMessages: (messages: AnnotatedMessage[]) => void
}

export const useChatStore = create<State & Actions>()(
  persist(
    (set) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
    }),
    { name: 'chat', storage: createJSONStorage(() => sessionStorage) }
  )
)
