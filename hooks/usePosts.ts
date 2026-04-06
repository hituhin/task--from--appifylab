'use client'

import { useState, useCallback } from 'react'
import { api } from '@/lib/api'

export interface PostAuthor {
  id: string
  firstName: string
  lastName: string
}

export interface PostData {
  id: string
  content: string
  imageUrl: string | null
  visibility: 'PUBLIC' | 'PRIVATE'
  createdAt: string
  authorId: string
  author: PostAuthor
  _count: { likes: number; comments: number }
  likes: { userId: string; reactionType?: string }[]
}

interface UsePostsReturn {
  posts: PostData[]
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>
  nextCursor: string | null
  isLoading: boolean
  loadMore: () => Promise<void>
  hasMore: boolean
}

export function usePosts(initialPosts: PostData[]): UsePostsReturn {
  const [posts, setPosts] = useState<PostData[]>(initialPosts)
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialPosts.length === 10 ? (initialPosts[initialPosts.length - 1]?.id ?? null) : null,
  )
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (isLoading || !nextCursor) return
    setIsLoading(true)
    try {
      const data = await api.posts.list(nextCursor)
      if (data.posts) {
        setPosts((prev) => [...prev, ...data.posts])
        setNextCursor(data.nextCursor ?? null)
      }
    } catch {
      // silent fail
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, nextCursor])

  return {
    posts,
    setPosts,
    nextCursor,
    isLoading,
    loadMore,
    hasMore: !!nextCursor,
  }
}
