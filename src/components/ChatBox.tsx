'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef } from 'react'

import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { useChatStore } from '@/store/useChatStore'

import { type UIMessage } from 'ai'
import { type Model, type Provider } from '@/lib/providers'

export type Annotations = { provider: Provider; model: Model }

export type AnnotatedMessage = UIMessage & {
  annotations?: Annotations[] | undefined
}

export type AnnotatedUIMessage = UIMessage & {
  annotations?: Annotations[] | undefined
}

function convertToUIMessages(
  messages: AnnotatedMessage[]
): AnnotatedUIMessage[] {
  return messages.map((message) => ({
    annotations: message.annotations,
    // Note: content will soon be deprecated in @ai-sdk/react
    // this is left here because useChat requires it for now
    content: '',
    createdAt: message.createdAt,
    id: message.id,
    parts: message.parts as UIMessage['parts'],
    role: message.role as UIMessage['role'],
  }))
}

export default function ChatBox() {
  const {
    apiKeys,
    messages: storeMessages,
    model,
    provider,
    setMessages: setStoreMessages,
  } = useChatStore()

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
    initialMessages: convertToUIMessages(storeMessages),
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
      <div className="m-auto w-full px-4 pb-8 sm:w-75/100">
        <ChatInput
          input={input}
          status={status}
          stop={stop}
          onHandleInputChange={handleInputChange}
          onHandleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
