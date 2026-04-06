'use client'

import { useState, useEffect } from 'react'
import CommentItem from './CommentItem'
import { api } from '@/lib/api'
import styles from './CommentSection.module.css'

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

interface CommentSectionProps {
  postId: string
  currentUser: { id: string; firstName: string; lastName: string }
  onCommentCountChange: (count: number) => void
}

export default function CommentSection({ postId, currentUser, onCommentCountChange }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([])
  const [loaded, setLoaded] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // load previous comments from API (newest first = desc from API)
  useEffect(() => {
    api.comments.list(postId).then((data) => {
      if (data.comments) {
        setComments(data.comments) // already ordered desc (newest first)
        setLoaded(true)
      }
    })
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || submitting) return
    setSubmitting(true)
    try {
      const data = await api.comments.create({ postId, content: commentText.trim() })
      if (data.comment) {
        // prepend new comment so it appears first
        setComments((prev) => [{ ...data.comment, replies: [] }, ...prev])
        setCommentText('')
        onCommentCountChange(comments.length + 1)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCommentDelete = (commentId: string) => {
    setComments((prev) => {
      const next = prev.filter((c) => c.id !== commentId)
      onCommentCountChange(next.length)
      return next
    })
  }

  return (
    <div className="_feed_inner_timeline_cooment_area">
      {/* Comment input box */}
      <div className="_feed_inner_comment_box">
        <form className="_feed_inner_comment_box_form" onSubmit={handleSubmit}>
          <div className="_feed_inner_comment_box_content">
            <div className="_feed_inner_comment_box_content_image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
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
          <div className="_feed_inner_comment_box_icon">
            <button type="submit" className={`_feed_inner_comment_box_icon_btn ${styles.sendBtn}`} disabled={submitting || !commentText.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 14 13">
                <path fill="#377dff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Comments list */}
      {loaded && comments.length > 0 && (
        <div className="_timline_comment_main">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUser.id}
              currentUser={currentUser}
              onDelete={handleCommentDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
