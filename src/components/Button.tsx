import Link from 'next/link'

import { tw } from '@/lib/utils'

export default function Button({
  children,
  className = '',
  href,
  onClick,
  size = 'medium',
  target = '_self',
  variant = 'primary',
  type,
}: {
  children: React.ReactNode
  className?: string
  href?: string | null | undefined
  onClick?: () => void
  size?: 'small' | 'medium'
  target?: '_self' | '_blank' | string | null | undefined
  variant?: 'primary' | 'ghost' | 'warning'
  type?: 'button' | 'submit'
}) {
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined

  const commonStyles = tw`grid cursor-pointer place-content-center rounded-full text-sm font-medium transition-colors sm:w-auto sm:text-base`

  const variants = {
    primary: tw`bg-neutral-500 text-neutral-300 hover:bg-neutral-600`,
    ghost: tw`grid min-h-[40px] min-w-[40px] cursor-pointer place-content-center sm:min-w-0`,
    warning: tw`bg-red-800`,
  }

  const sizes = {
    small: tw`h-8 px-2 sm:h-10 sm:px-3`,
    medium: tw`h-10 px-4 sm:h-12 sm:px-5`,
  }

  let styles = `${commonStyles} ${variants[variant]} ${sizes[size]}`

  if (variant === 'ghost') {
    styles = `${variants[variant]}`
  }

  const classes = `${styles} ${className}`

  return href ? (
    <Link
      className={classes}
      href={href ?? undefined}
      target={target ?? undefined}
      rel={rel}
    >
      {children}
    </Link>
  ) : (
    <button className={classes} onClick={onClick} type={type}>
      {children}
    </button>
  )
}
