'use client'

import { useState, useCallback } from 'react'

interface UseLikeOptions {
  initialLiked: boolean
  initialCount: number
  toggleFn: () => Promise<{ liked: boolean; count: number }>
}

export function useLike({ initialLiked, initialCount, toggleFn }: UseLikeOptions) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)

  const toggle = useCallback(async () => {
    if (isLoading) return

    // Optimistic update
    const prevLiked = liked
    const prevCount = count
    setLiked(!prevLiked)
    setCount(prevLiked ? prevCount - 1 : prevCount + 1)
    setIsLoading(true)

    try {
      const result = await toggleFn()
      setLiked(result.liked)
      setCount(result.count)
    } catch {
      // Rollback on error
      setLiked(prevLiked)
      setCount(prevCount)
    } finally {
      setIsLoading(false)
    }
  }, [liked, count, isLoading, toggleFn])

  return { liked, count, toggle, isLoading }
}
