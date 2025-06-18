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
  variant?: 'primary' | 'ghost'
  type?: 'button' | 'submit'
}) {
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined

  const commonStyles = tw`grid cursor-pointer place-content-center rounded-full text-sm font-medium transition-colors sm:w-auto sm:text-base`

  // Variants
  const primaryStyles = tw`bg-neutral-500 text-neutral-300 hover:bg-neutral-600`
  const ghostStyles = tw`grid min-h-[40px] min-w-[40px] cursor-pointer place-content-center sm:min-w-0`
  const variants = {
    primary: primaryStyles,
    ghost: ghostStyles,
  }

  // Sizes
  const smallStyles = tw`h-8 px-2 sm:h-10 sm:px-3`
  const mediumStyles = tw`h-10 px-4 sm:h-12 sm:px-5`
  const sizes = {
    small: smallStyles,
    medium: mediumStyles,
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
