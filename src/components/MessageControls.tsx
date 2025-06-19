import { useState } from 'react'

import Button from '@/components/Button'
import ProviderIcon from '@/components/ProviderIcon'

import type { AnnotatedMessage } from '@/types/message'
import type { Model, Provider } from '@/types/provider'

export default function MessageControls({
  onDeleteMessage,
  onRequestMessageEdit,
  onSaveMessageEdit,
  model,
  provider,
  role,
}: {
  onDeleteMessage: () => void
  onRequestMessageEdit: (isEditing: boolean) => void
  onSaveMessageEdit: () => void
  model: Model | undefined
  provider: Provider | undefined
  role: AnnotatedMessage['role']
}) {
  const [editingMessage, setEditingMessage] = useState(false)

  const handleConfirmDeleteMessage = () => {
    const confirmation = window?.confirm(
      'Are you sure you want to delete this message?'
    )
    if (confirmation) onDeleteMessage()
  }

  const handleToggleEditMessage = () => {
    const editing = !editingMessage
    setEditingMessage(editing)
    onRequestMessageEdit(editing)
  }

  const handleSaveMessageEdit = () => {
    setEditingMessage(false)
    onRequestMessageEdit(false)
    onSaveMessageEdit()
  }

  return (
    <div className="flex gap-4">
      {!editingMessage ? (
        <Button
          variant="ghost"
          aria-label="Delete Message"
          onClick={handleConfirmDeleteMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="12"
            height="13.71"
          >
            <path
              fill="currentColor"
              d="M135.2 17.7 128 32H32C14.3 32 0 46.3 0 64s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z"
            />
          </svg>
        </Button>
      ) : null}

      <Button
        variant="ghost"
        onClick={handleToggleEditMessage}
        aria-label={editingMessage ? 'Cancel Message Edits' : 'Edit Message'}
      >
        {editingMessage ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="12"
          >
            <path
              fill="currentColor"
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256l105.3-105.4z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="12"
            height="12"
          >
            <path
              fill="currentColor"
              d="m410.3 231 11.3-11.3-33.9-33.9-62.1-62.1-33.9-33.9-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2l199.2-199.2 22.6-22.7zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9l-78.2 23 23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7l-14.4 14.5-22.6 22.6-11.4 11.3 33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5l-39.3-39.4c-25-25-65.5-25-90.5 0zm-47.4 168-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
            />
          </svg>
        )}
      </Button>

      {/* Submit Edit */}
      {editingMessage ? (
        <Button
          variant="ghost"
          onClick={handleSaveMessageEdit}
          aria-label="Save Message Edits"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="12"
          >
            <path
              fill="currentColor"
              d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7l233.4-233.3c12.5-12.5 32.8-12.5 45.3 0z"
            />
          </svg>
        </Button>
      ) : null}

      {/* Copy */}

      {/* Switch Model */}

      {role === 'assistant' ? (
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          {provider ? (
            <div aria-label={provider} title={provider}>
              <ProviderIcon provider={provider} />
            </div>
          ) : null}{' '}
          {model}
        </div>
      ) : null}
    </div>
  )
}
