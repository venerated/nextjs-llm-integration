import { forwardRef, InputHTMLAttributes } from 'react'

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  error?: string
  hideLabel?: boolean
  label?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className = '', error, label, hideLabel = false, onKeyDown, ...props },
    ref
  ) => {
    return (
      <div className={`flex flex-col ${className}`}>
        {label ? (
          <label
            htmlFor={props.id}
            className={`mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 ${hideLabel ? 'sr-only' : ''}`}
          >
            {label}
          </label>
        ) : null}
        <textarea
          id={props.id}
          ref={ref}
          className="grow resize-none text-base placeholder-neutral-400 focus:outline-0"
          onKeyDown={onKeyDown}
          aria-label={label && hideLabel ? label : undefined}
          {...props}
        />
        {error && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </span>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

export default TextArea
