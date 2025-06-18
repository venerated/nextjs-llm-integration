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
    let isMounted = true
    const valueHasChanged = watchedValue > prevWatchedValue.current

    if (valueHasChanged || !isIdle) {
      if (scrollRef.current !== null) {
        cancelAnimationFrame(scrollRef.current)
      }

      scrollRef.current = requestAnimationFrame(() => {
        if (isMounted) {
          scrollPositionWatcherRef.current?.scrollIntoView({
            behavior: 'smooth',
          })
        }
        scrollRef.current = null
      })
    }

    prevWatchedValue.current = watchedValue

    return () => {
      isMounted = false
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
