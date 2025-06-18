import { ChangeEvent, forwardRef, InputHTMLAttributes } from 'react'

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  className?: string
  error?: string
  label?: string
  options: {
    label: string
    value: string
  }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, id, label, options, ...props }, ref) => {
    const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
      if (props.onChange) {
        props.onChange(e)
      }
    }

    return (
      <div className={`flex flex-col ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          value={props?.value ?? ''}
          className="block w-full rounded-lg bg-neutral-700 p-2.5 text-sm"
          onChange={handleSelect}
          {...props}
        >
          <option value="">{props?.placeholder ?? 'Make a selection'}</option>
          {options?.length
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : null}
        </select>

        {error && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
