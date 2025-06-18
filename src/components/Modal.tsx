'use client'

import { PropsWithChildren, useEffect, useRef } from 'react'

type ModalProps = {
  className?: string
  open: boolean // driven by parent state
  onClose(): void // called on ⎋ or backdrop click
}

/**
 * Native-API modal:
 * – Primary path: <div popover> + showPopover/hidePopover
 * – Fallback:     <dialog> + showModal/close
 * Both paths get wrapped in View Transition if available.
 */
export default function Modal({
  className,
  open,
  onClose,
  children,
}: PropsWithChildren<ModalProps>) {
  // popover & dialog share enough to treat as HTMLElement
  const nodeRef = useRef<HTMLDivElement>(null)

  // sync `open` prop with underlying element
  useEffect(() => {
    const $el = nodeRef.current
    if (!$el) return

    const withViewTransition = (fn: () => void) => {
      if (document.startViewTransition) {
        document.startViewTransition(fn) // smooth fade/cross-fade
      } else fn()
    }

    if (open) {
      if ('showPopover' in $el) {
        withViewTransition(() => $el.showPopover())
      }
    } else {
      if ('hidePopover' in $el) {
        withViewTransition(() => $el.hidePopover())
      }
    }
  }, [open])

  // close on Esc / backdrop
  useEffect(() => {
    const $el = nodeRef.current
    if (!$el) return

    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const handleClick = (e: MouseEvent) => {
      // click outside content (in ::backdrop)
      if (e.target === $el) onClose()
    }

    $el.addEventListener('keyup', handleKey)
    $el.addEventListener('click', handleClick)
    return () => {
      $el.removeEventListener('keyup', handleKey)
      $el.removeEventListener('click', handleClick)
    }
  }, [onClose])

  return (
    <div
      ref={nodeRef}
      popover="manual"
      role="dialog"
      aria-modal="true"
      className={`mx-auto mt-[10vh] max-h-[80vh] w-[min(90vw,520px)] overflow-auto rounded-lg bg-neutral-800 p-6 ${className}`}
    >
      {children}
    </div>
  )
}
