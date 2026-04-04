'use client'

import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import CommentItem from './CommentItem'
import { api } from '@/lib/api'
import styles from './CommentSection.module.css'

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

interface CommentSectionProps {
  postId: string
  initialComments?: CommentData[]
  currentUser: { id: string; firstName: string; lastName: string }
}

export default function CommentSection({
  postId,
  initialComments = [],
  currentUser,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || submitting) return
    setSubmitting(true)
    try {
      const data = await api.comments.create({ postId, content: commentText.trim() })
      if (data.comment) {
        setComments((prev) => [...prev, { ...data.comment, replies: [] }])
        setCommentText('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCommentDelete = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  return (
    <div className="_feed_inner_timeline_cooment_area">
      <div className="_feed_inner_comment_box">
        <form className="_feed_inner_comment_box_form" onSubmit={handleSubmit}>
          <div className="_feed_inner_comment_box_content">
            <div className="_feed_inner_comment_box_content_image">
              <Avatar
                firstName={currentUser.firstName}
                lastName={currentUser.lastName}
                size="sm"
              />
            </div>
            <div className="_feed_inner_comment_box_content_txt">
              <textarea
                className="form-control _comment_textarea"
                placeholder="Write a comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as unknown as React.FormEvent)
                  }
                }}
              />
            </div>
          </div>
          <div className={styles.submitRow}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting || !commentText.trim()}
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {comments.length > 0 && (
        <div className="_timline_comment_main">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUser.id}
              onDelete={handleCommentDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
