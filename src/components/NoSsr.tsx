'use client'

import React, { useState, useEffect } from 'react'

function NoSsr({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default NoSsr
