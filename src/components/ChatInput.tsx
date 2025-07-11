'use client'

import { useRef, useState } from 'react'

import Button from '@/components/Button'
import Textarea from '@/components/Textarea'
import Modal from '@/components/Modal'
import Settings from '@/components/Settings'

import { type UseChatHelpers } from '@ai-sdk/react'
import type { AnnotatedMessage } from '@/types/message'

export default function ChatInput({
  input,
  status,
  stop,
  onHandleInputChange,
  onHandleSubmit,
  mutateMessages,
}: {
  input: string
  status: UseChatHelpers['status']
  stop: () => void
  onHandleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  onHandleSubmit: () => void
  mutateMessages: (messages: AnnotatedMessage[]) => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const freezeInput = status === 'submitted' || status === 'streaming'

  const handleStopStream = (e?: React.SyntheticEvent) => {
    e?.preventDefault()
    stop()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (freezeInput) {
        handleStopStream(e)
      } else {
        formRef.current?.requestSubmit()
      }
    }
  }

  return (
    <div className="rounded-3xl bg-neutral-700 p-4 text-sm font-medium sm:text-base">
      <form
        ref={formRef}
        onSubmit={freezeInput ? handleStopStream : onHandleSubmit}
        className="flex gap-4"
      >
        <Textarea
          className="w-100 grow"
          hideLabel={true}
          id="chat-message-input"
          label="Chat Message"
          onChange={onHandleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          value={input}
        />
        <div className="flex flex-col gap-2">
          {freezeInput ? (
            <Button variant="primary" type="submit" aria-label="Stop">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                width="12"
              >
                <path
                  fill="currentColor"
                  d="M0 128c0-35.3 28.7-64 64-64h256c35.3 0 64 28.7 64 64v256c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"
                />
              </svg>
            </Button>
          ) : (
            <Button variant="primary" type="submit" aria-label="Send">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                width="15"
              >
                <path
                  fill="currentColor"
                  d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                />
              </svg>
            </Button>
          )}
          <Button variant="primary" onClick={() => setShowSettingsModal(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="18"
              height="18"
            >
              <path
                fill="currentColor"
                d="M495.9 166.6c3.2 8.7.5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4l-55.6 17.8c-8.8 2.8-18.6.3-24.5-6.8-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4c-1.1-8.4-1.7-16.9-1.7-25.5s.6-17.1 1.7-25.4l-43.3-39.4c-6.9-6.2-9.6-15.9-6.4-24.6 4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2 5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8 8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
              />
            </svg>
          </Button>
        </div>
      </form>
      <Modal
        className="text-neutral-300"
        open={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      >
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-3xl font-bold">Settings</h2>
          <Button onClick={() => setShowSettingsModal(false)} variant="primary">
            Close
          </Button>
        </div>
        <Settings onClearChat={() => mutateMessages([])} />
      </Modal>
    </div>
  )
}
