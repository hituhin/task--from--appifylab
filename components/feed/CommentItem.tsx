'use client'

import { useState } from 'react'
import LikedByModal from './LikedByModal'
import ReplyItem from './ReplyItem'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { useLike } from '@/hooks/useLike'
import styles from './CommentItem.module.css'

interface Author { id: string; firstName: string; lastName: string }

interface ReplyData {
  id: string; content: string; createdAt: string; authorId: string
  author: Author; _count: { likes: number }; likes: { userId: string }[]
}

interface CommentData {
  id: string; content: string; createdAt: string; authorId: string
  author: Author; _count: { likes: number; replies: number }
  likes: { userId: string }[]; replies?: ReplyData[]
}

interface CommentItemProps {
  comment: CommentData
  currentUserId: string
  currentUser: { id: string; firstName: string; lastName: string }
  onDelete: (commentId: string) => void
}

export default function CommentItem({ comment, currentUserId, currentUser, onDelete }: CommentItemProps) {
  const [showLikers, setShowLikers] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replies, setReplies] = useState<ReplyData[]>(comment.replies ?? [])
  const [submittingReply, setSubmittingReply] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  const isOwn = comment.authorId === currentUserId
  const initialLiked = comment.likes.some((l) => l.userId === currentUserId)

  const { liked, count: likeCount, toggle } = useLike({
    initialLiked,
    initialCount: comment._count.likes,
    toggleFn: () => api.comments.like(comment.id),
  })

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return
    await api.comments.delete(comment.id)
    onDelete(comment.id)
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || submittingReply) return
    setSubmittingReply(true)
    try {
      const data = await api.replies.create({ commentId: comment.id, content: replyText.trim() })
      if (data.reply) {
        setReplies((prev) => [...prev, data.reply])
        setReplyText('')
        setShowReplies(true)
        setShowReplyInput(false)
      }
    } finally {
      setSubmittingReply(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className="_comment_main">
        <div className="_comment_image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/txt_img.png" alt={comment.author.firstName} className="_comment_img1" />
        </div>
        <div className="_comment_area">
          <div className="_comment_details">
            <div className="_comment_details_top">
              <div className="_comment_name">
                <a href="#0"><h4 className="_comment_name_title">{comment.author.firstName} {comment.author.lastName}</h4></a>
              </div>
            </div>
            <div className="_comment_status">
              <p className="_comment_status_text"><span>{comment.content}</span></p>
            </div>

            {/* Reaction badge inside bubble */}
            {likeCount > 0 && (
              <div className="_total_reactions" onClick={() => setShowLikers(true)}>
                <div className="_total_react">
                  <span className="_reaction_like">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                  </span>
                </div>
                <span className="_total">{likeCount}</span>
              </div>
            )}

          </div>

          {/* Like / Reply / Share / time row — outside bubble to avoid absolute positioning clip */}
          <div className={styles.actionRow}>
            <span className={liked ? styles.likedLink : styles.likeLink} onClick={toggle}>Like.</span>
            <span className={styles.actionLink} onClick={() => setShowReplyInput((v) => !v)}>Reply.</span>
            <span className={styles.actionLink}>Share</span>
            <span className="_time_link">.{formatDate(comment.createdAt)}</span>
            {isOwn && (
              <span className={styles.deleteLink} onClick={handleDelete}>Delete</span>
            )}
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <div className={styles.replyBox}>
              <div className="_comment_image" style={{ flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/images/comment_img.png" alt="" className="_comment_img1" />
              </div>
              <form className={styles.replyForm} onSubmit={handleReplySubmit}>
                <textarea
                  className={`form-control _comment_textarea ${styles.replyInput}`}
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                />
                <button type="submit" className={styles.replySubmit} disabled={submittingReply || !replyText.trim()}>
                  Reply
                </button>
              </form>
            </div>
          )}

          {/* Replies */}
          {replies.length > 0 && (
            <div className={styles.repliesWrap}>
              <button type="button" className={styles.toggleReplies} onClick={() => setShowReplies((v) => !v)}>
                {showReplies ? 'Hide replies' : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
              </button>
              {showReplies && replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  currentUserId={currentUserId}
                  onDelete={(id) => setReplies((prev) => prev.filter((r) => r.id !== id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <LikedByModal isOpen={showLikers} onClose={() => setShowLikers(false)} fetchLikers={() => api.comments.likers(comment.id)} />
    </div>
  )
}
