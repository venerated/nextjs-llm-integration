'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef } from 'react'

import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { useChatStore } from '@/store/useChatStore'
import { useSettingsStore } from '@/store/useSettingsStore'

import type { AnnotatedMessage } from '@/types/message'

export default function ChatBox() {
  const { messages: storeMessages, setMessages: setStoreMessages } =
    useChatStore()

  const { apiKeys, model, provider } = useSettingsStore()

  const {
    error,
    reload,
    input,
    handleInputChange,
    handleSubmit,
    messages,
    status,
    setMessages,
    stop,
  } = useChat({
    initialMessages: storeMessages,
    body: { provider, model, apiKeys },
    sendExtraMessageFields: true,
  }) as ReturnType<typeof useChat> & {
    messages: AnnotatedMessage[]
  }

  const messagesRef = useRef(messages)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    if (status === 'ready') {
      setStoreMessages(messagesRef.current)
    }
  }, [status, setStoreMessages])

  const mutateMessages = (messages: AnnotatedMessage[]) => {
    setMessages(messages)
    setStoreMessages(messages)
  }

  return (
    <div className="flex h-full w-full flex-col">
      <Messages
        error={error}
        messages={messages}
        status={status}
        reload={reload}
        mutateMessages={mutateMessages}
      />
      <div className="m-auto w-full max-w-[75ch] px-4 pb-8 sm:w-75/100">
        <ChatInput
          input={input}
          status={status}
          stop={stop}
          onHandleInputChange={handleInputChange}
          onHandleSubmit={handleSubmit}
          mutateMessages={mutateMessages}
        />
      </div>
    </div>
  )
}
