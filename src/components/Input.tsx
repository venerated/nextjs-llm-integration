import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  error?: string
  label?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        type="text"
        className={`rounded bg-neutral-700 px-3 py-2 text-base placeholder-gray-400 ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  )
)

Input.displayName = 'Input'

export default Input
