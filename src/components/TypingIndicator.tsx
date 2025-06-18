import React from 'react'

import styles from '@/components/TypingIndicator.module.scss'

export default function TypingIndicator() {
  return (
    <div className={styles.wrapper} aria-label="Assistant is typing">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  )
}
