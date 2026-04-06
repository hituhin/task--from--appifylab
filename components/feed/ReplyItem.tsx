'use client'

import { useState } from 'react'
import LikedByModal from './LikedByModal'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { useLike } from '@/hooks/useLike'
import styles from './ReplyItem.module.css'

interface ReplyAuthor { id: string; firstName: string; lastName: string }

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

  const { liked, count: likeCount, toggle } = useLike({
    initialLiked,
    initialCount: reply._count.likes,
    toggleFn: () => api.replies.like(reply.id),
  })

  const handleDelete = async () => {
    if (!confirm('Delete this reply?')) return
    await api.replies.delete(reply.id)
    onDelete(reply.id)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.replyMain}>
      {/* Avatar */}
      <div className="_comment_image" style={{ flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/txt_img.png" alt={reply.author.firstName} className="_comment_img1" />
      </div>

      <div className={styles.content}>
        {/* Bubble */}
        <div className="_comment_details" style={{ marginBottom: 8 }}>
          <div className="_comment_details_top">
            <div className="_comment_name">
              <a href="#0"><h4 className="_comment_name_title">{reply.author.firstName} {reply.author.lastName}</h4></a>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text"><span>{reply.content}</span></p>
          </div>

          {/* Like badge inside bubble */}
          {likeCount > 0 && (
            <div className="_total_reactions" onClick={() => setShowLikers(true)}>
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </span>
                <span className="_total">{likeCount}</span>
              </div>
            </div>
          )}

        </div>
      </div>
      </div>{/* end replyMain */}

      {/* Action row */}
      <div className={styles.actionRow}>
        <span className={liked ? styles.likedLink : styles.likeLink} onClick={toggle}>Like.</span>
        <span className={styles.actionLink}>Share</span>
        <span className="_time_link">.{formatDate(reply.createdAt)}</span>
        {isOwn && (
          <span className={styles.deleteLink} onClick={handleDelete}>Delete</span>
        )}
      </div>

      <LikedByModal isOpen={showLikers} onClose={() => setShowLikers(false)} fetchLikers={() => api.replies.likers(reply.id)} />
    </div>
  )
}
