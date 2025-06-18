import { useEffect, useRef, useState } from 'react'

import MessageControls from '@/components/MessageControls'
import Textarea from '@/components/Textarea'

import { type UseChatHelpers } from '@ai-sdk/react'
import { type AnnotatedMessage } from '@/types/message'

export default function Message({
  message,
  onDeleteMessage,
  onEditMessage,
  status,
  isMostRecentMessage,
}: {
  message: AnnotatedMessage
  onDeleteMessage: (id: string) => void
  onEditMessage: (id: string, draft: string) => void
  status: UseChatHelpers['status']
  isMostRecentMessage: boolean
}) {
  const role = message.role
  const provider = message?.annotations?.[0]?.provider
  const model = message?.annotations?.[0]?.model

  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(
    (
      message.parts?.[0] as {
        type: 'text'
        text: string
      }
    )?.text ?? '' // plain-text case
  )
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isEditing) return
    const el = textareaRef.current
    if (!el) return

    el.focus()

    // Place cursor at the end of the current text
    const end = el.value.length
    el.setSelectionRange(end, end)
  }, [isEditing])

  const handleSaveMessageEdit = (e?: React.SyntheticEvent) => {
    e?.preventDefault()
    setIsEditing(false)
    onEditMessage(message.id, draft)
  }

  // Controls Styling
  const [showUserControls, setShowUserControls] = useState(false)
  const showAssitantControls = status === 'ready' || !isMostRecentMessage
  const assistantMessageClasses = `${showAssitantControls ? 'visible' : 'invisible'}`
  const userMessageClasses = `self-end transition-[opacity] ${showUserControls ? 'opacity-100' : 'opacity-0'}`

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => setShowUserControls(true)}
      onMouseLeave={() => setShowUserControls(false)}
    >
      <div
        className={`whitespace-pre-wrap ${role === 'user' ? 'max-w-75/100 self-end rounded-3xl bg-neutral-700 px-5 py-3' : ''}`}
      >
        {isEditing ? (
          <form
            onSubmit={handleSaveMessageEdit}
            className="flex items-center gap-2"
          >
            <Textarea
              ref={textareaRef}
              id="edit-message"
              label="Edit Message"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </form>
        ) : (
          message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>
            }
          })
        )}
      </div>
      <div
        className={`${role === 'user' ? userMessageClasses : assistantMessageClasses}`}
      >
        <MessageControls
          onDeleteMessage={() => onDeleteMessage(message.id)}
          onRequestMessageEdit={(editing) => setIsEditing(editing)}
          onSaveMessageEdit={handleSaveMessageEdit}
          model={model}
          provider={provider}
          role={role}
        />
      </div>
    </div>
  )
}
