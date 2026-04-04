'use client'

import { useState, useCallback } from 'react'
import Avatar from '@/components/ui/Avatar'
import LikeButton from './LikeButton'
import LikedByModal from './LikedByModal'
import ReplyItem from './ReplyItem'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import styles from './CommentItem.module.css'

interface Author {
  id: string
  firstName: string
  lastName: string
}

interface ReplyData {
  id: string
  content: string
  createdAt: string
  authorId: string
  author: Author
  _count: { likes: number }
  likes: { userId: string }[]
}

interface CommentData {
  id: string
  content: string
  createdAt: string
  authorId: string
  author: Author
  _count: { likes: number; replies: number }
  likes: { userId: string }[]
  replies?: ReplyData[]
}

interface CommentItemProps {
  comment: CommentData
  currentUserId: string
  onDelete: (commentId: string) => void
}

export default function CommentItem({ comment, currentUserId, onDelete }: CommentItemProps) {
  const [showLikers, setShowLikers] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replies, setReplies] = useState<ReplyData[]>(comment.replies ?? [])
  const [submittingReply, setSubmittingReply] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  const isOwn = comment.authorId === currentUserId
  const initialLiked = comment.likes.some((l) => l.userId === currentUserId)

  const fetchLikers = useCallback(() => api.comments.likers(comment.id), [comment.id])

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

  const handleReplyDelete = (replyId: string) => {
    setReplies((prev) => prev.filter((r) => r.id !== replyId))
  }

  return (
    <div className={styles.wrap}>
      <div className="_comment_main">
        <div className="_comment_image">
          <Avatar firstName={comment.author.firstName} lastName={comment.author.lastName} size="sm" />
        </div>
        <div className="_comment_area">
          <div className="_comment_details">
            <div className="_comment_details_top">
              <div className="_comment_name">
                <h4 className="_comment_name_title">
                  {comment.author.firstName} {comment.author.lastName}
                </h4>
              </div>
            </div>
            <div className="_comment_status">
              <p className="_comment_status_text">
                <span>{comment.content}</span>
              </p>
            </div>
            <div className="_comment_reply">
              <div className="_comment_reply_num">
                <ul className="_comment_reply_list">
                  <li>
                    <LikeButton
                      initialLiked={initialLiked}
                      initialCount={comment._count.likes}
                      toggleFn={() => api.comments.like(comment.id)}
                      onCountClick={() => setShowLikers(true)}
                      variant="inline"
                    />
                  </li>
                  <li>
                    <span
                      className={styles.replyLink}
                      onClick={() => setShowReplyInput(!showReplyInput)}
                    >
                      Reply.
                    </span>
                  </li>
                  <li>
                    <span className="_time_link">{formatDate(comment.createdAt)}</span>
                  </li>
                  {isOwn && (
                    <li>
                      <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
                        Delete
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {showReplyInput && (
            <form className={styles.replyForm} onSubmit={handleReplySubmit}>
              <textarea
                className={`form-control _comment_textarea ${styles.replyInput}`}
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
              />
              <button
                type="submit"
                className={styles.replySubmit}
                disabled={submittingReply || !replyText.trim()}
              >
                Reply
              </button>
            </form>
          )}

          {replies.length > 0 && (
            <div className={styles.repliesWrap}>
              <button
                type="button"
                className={styles.toggleReplies}
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? 'Hide' : `View ${replies.length}`} {replies.length === 1 ? 'reply' : 'replies'}
              </button>
              {showReplies &&
                replies.map((reply) => (
                  <ReplyItem
                    key={reply.id}
                    reply={reply}
                    currentUserId={currentUserId}
                    onDelete={handleReplyDelete}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      <LikedByModal isOpen={showLikers} onClose={() => setShowLikers(false)} fetchLikers={fetchLikers} />
    </div>
  )
}
