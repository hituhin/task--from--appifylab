'use client'

import { useState, useCallback } from 'react'
import Avatar from '@/components/ui/Avatar'
import LikeButton from './LikeButton'
import LikedByModal from './LikedByModal'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import styles from './ReplyItem.module.css'

interface ReplyAuthor {
  id: string
  firstName: string
  lastName: string
}

interface Reply {
  id: string
  content: string
  createdAt: string
  authorId: string
  author: ReplyAuthor
  _count: { likes: number }
  likes: { userId: string }[]
}

interface ReplyItemProps {
  reply: Reply
  currentUserId: string
  onDelete: (replyId: string) => void
}

export default function ReplyItem({ reply, currentUserId, onDelete }: ReplyItemProps) {
  const [showLikers, setShowLikers] = useState(false)
  const isOwn = reply.authorId === currentUserId
  const initialLiked = reply.likes.some((l) => l.userId === currentUserId)

  const fetchLikers = useCallback(() => api.replies.likers(reply.id), [reply.id])

  const handleDelete = async () => {
    if (!confirm('Delete this reply?')) return
    await api.replies.delete(reply.id)
    onDelete(reply.id)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.avatar}>
        <Avatar firstName={reply.author.firstName} lastName={reply.author.lastName} size="sm" />
      </div>
      <div className={styles.content}>
        <div className={styles.bubble}>
          <span className={styles.name}>
            {reply.author.firstName} {reply.author.lastName}
          </span>
          <p className={styles.text}>{reply.content}</p>
        </div>
        <div className={styles.actions}>
          <LikeButton
            initialLiked={initialLiked}
            initialCount={reply._count.likes}
            toggleFn={() => api.replies.like(reply.id)}
            onCountClick={() => setShowLikers(true)}
            variant="inline"
          />
          <span className={styles.time}>{formatDate(reply.createdAt)}</span>
          {isOwn && (
            <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
      <LikedByModal isOpen={showLikers} onClose={() => setShowLikers(false)} fetchLikers={fetchLikers} />
    </div>
  )
}
