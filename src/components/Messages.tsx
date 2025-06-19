'use client'

import React from 'react'

import Button from '@/components/Button'
import Message from '@/components/Message'
import TypingIndicator from '@/components/TypingIndicator'
import { useScrollToElement } from '@/hooks/useScrollToElement'

import { type UseChatHelpers } from '@ai-sdk/react'
import type { AnnotatedMessage } from '@/types/message'

export default function Messages({
  error,
  messages,
  status,
  reload,
  mutateMessages,
}: {
  error: Error | undefined
  messages: AnnotatedMessage[]
  status: UseChatHelpers['status']
  reload: () => void
  mutateMessages: (messages: AnnotatedMessage[]) => void
}) {
  const { containerRef, scrollPositionWatcherRef } = useScrollToElement(
    messages.length,
    status !== 'ready'
  )

  const handleDeleteMessage = (id: string) => {
    mutateMessages(messages.filter((message) => message.id !== id))
  }

  const handleEditMessage = (id: string, newText: string) => {
    mutateMessages(
      messages.map((m) =>
        m.id === id
          ? {
              ...m,
              parts: [{ type: 'text', text: newText }],
            }
          : m
      )
    )
    reload()
  }

  return (
    <div className="grow basis-auto flex-col overflow-hidden">
      <div className="h-full">
        <div ref={containerRef} className="h-full overflow-y-auto pb-10">
          <div className="m-auto flex h-auto w-full max-w-[75ch] flex-col gap-4 px-4 pt-8 sm:w-75/100">
            {messages.map((message: AnnotatedMessage) => (
              <Message
                key={message.id}
                onDeleteMessage={handleDeleteMessage}
                onEditMessage={handleEditMessage}
                message={message}
                status={status}
                isMostRecentMessage={
                  messages.findIndex((m) => m.id === message.id) ===
                  messages.length - 1
                }
              />
            ))}
            {status === 'submitted' ? <TypingIndicator /> : null}
            {error ? (
              <React.Fragment>
                <div>{error?.message}</div>
                <Button variant="primary" onClick={() => reload()}>
                  Retry
                </Button>
              </React.Fragment>
            ) : null}
          </div>
          {/* Element for useScrollToElement */}
          <div ref={scrollPositionWatcherRef} />
        </div>
      </div>
    </div>
  )
}
