import { useEffect, useRef } from 'react'

export function useScrollToElement<T extends HTMLElement = HTMLDivElement>(
  watchedValue: number,
  isIdle: boolean
) {
  const containerRef = useRef<T | null>(null)
  const scrollPositionWatcherRef = useRef<T | null>(null)
  const scrollRef = useRef<number | null>(null)
  const didInitialScroll = useRef(false)
  const prevWatchedValue = useRef<number>(watchedValue)

  useEffect(() => {
    const valueHasChanged = watchedValue > prevWatchedValue.current

    if (valueHasChanged || !isIdle) {
      if (scrollRef.current !== null) {
        cancelAnimationFrame(scrollRef.current)
      }

      scrollRef.current = requestAnimationFrame(() => {
        scrollPositionWatcherRef.current?.scrollIntoView({ behavior: 'smooth' })
        scrollRef.current = null
      })
    }

    prevWatchedValue.current = watchedValue

    return () => {
      if (scrollRef.current !== null) cancelAnimationFrame(scrollRef.current)
    }
  }, [watchedValue, isIdle])

  useEffect(() => {
    if (didInitialScroll.current) return
    requestAnimationFrame(() => {
      scrollPositionWatcherRef.current?.scrollIntoView({ behavior: 'auto' })
      didInitialScroll.current = true
    })
  }, [])

  return {
    containerRef,
    scrollPositionWatcherRef,
  }
}
