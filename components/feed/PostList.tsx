'use client'

import { useEffect, useRef } from 'react'
import PostCard from './PostCard'
import Spinner from '@/components/ui/Spinner'
import styles from './PostList.module.css'

interface Author {
  id: string
  firstName: string
  lastName: string
}

interface PostData {
  id: string
  content: string
  imageUrl: string | null
  visibility: 'PUBLIC' | 'PRIVATE'
  createdAt: string
  authorId: string
  author: Author
  _count: { likes: number; comments: number }
  likes: { userId: string }[]
}

interface PostListProps {
  posts: PostData[]
  currentUser: { id: string; firstName: string; lastName: string }
  onDelete: (postId: string) => void
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}

export default function PostList({
  posts,
  currentUser,
  onDelete,
  onLoadMore,
  hasMore,
  isLoading,
}: PostListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  if (posts.length === 0 && !isLoading) {
    return (
      <div className={styles.empty}>
        <p>No posts yet. Be the first to share something!</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUser={currentUser} onDelete={onDelete} />
      ))}

      <div ref={sentinelRef} className={styles.sentinel} />

      {isLoading && (
        <div className={styles.loadingWrap}>
          <Spinner />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className={styles.endMessage}>You&apos;ve reached the end!</p>
      )}
    </div>
  )
}
