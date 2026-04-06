'use client'

import { useState, useRef, useEffect } from 'react'
import LikedByModal from './LikedByModal'
import { api } from '@/lib/api'
import styles from './PostActions.module.css'

const EMOJIS = [
  { type: 'like',    label: 'Like',   svg: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#377DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg> },
  { type: 'love',    label: 'Love',   svg: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { type: 'haha',    label: 'Haha',   svg: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 19 19"><path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/><path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/><path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"/><path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"/></svg> },
  { type: 'wow',     label: 'Wow',    svg: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 19 19"><path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/><path fill="#664500" d="M6.333 7.125c.729 0 1.32-.827 1.32-1.847s-.591-1.848-1.32-1.848c-.729 0-1.32.828-1.32 1.848s.591 1.847 1.32 1.847zM12.667 7.125c.729 0 1.32-.827 1.32-1.847s-.591-1.848-1.32-1.848c-.729 0-1.32.828-1.32 1.848s.591 1.847 1.32 1.847z"/><ellipse cx="9.5" cy="14.25" fill="#664500" rx="2.375" ry="3.167"/></svg> },
  { type: 'sad',     label: 'Sad',    svg: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 19 19"><path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/><path fill="#664500" d="M9.5 12.636c-1.583 0-3.167.528-3.167 1.056 0 1.583 1.584 2.641 3.167 2.641 1.582 0 3.166-1.058 3.166-2.641 0-.528-1.583-1.056-3.166-1.056z"/><path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"/></svg> },
  { type: 'angry',   label: 'Angry',  svg: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 19 19"><path fill="#E9994A" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/><path fill="#664500" d="M9.5 12.636c-1.583 0-3.167.528-3.167 1.056 0 1.583 1.584 2.641 3.167 2.641 1.582 0 3.166-1.058 3.166-2.641 0-.528-1.583-1.056-3.166-1.056zM5.278 5.277l2.375 1.584-2.375 1.583M13.722 5.277l-2.375 1.584 2.375 1.583"/></svg> },
]

interface PostActionsProps {
  postId: string
  initialLiked: boolean
  initialReactionType: string | null
  initialLikeCount: number
  onCommentToggle: () => void
  onLikeChange: (count: number) => void
}

export default function PostActions({
  postId, initialLiked, initialReactionType, initialLikeCount,
  onCommentToggle, onLikeChange,
}: PostActionsProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [reactionType, setReactionType] = useState<string | null>(initialReactionType)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [showPicker, setShowPicker] = useState(false)
  const [showLikers, setShowLikers] = useState(false)
  const [loading, setLoading] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  const currentEmoji = EMOJIS.find((e) => e.type === reactionType) ?? null

  const sendReaction = async (type: string) => {
    if (loading) return
    setLoading(true)
    setShowPicker(false)
    try {
      const data = await api.posts.like(postId, type)
      setLiked(data.liked)
      setReactionType(data.liked ? data.reactionType : null)
      setLikeCount(data.count)
      onLikeChange(data.count)
    } finally {
      setLoading(false)
    }
  }

  // close picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleReactionButtonClick = () => {
    if (liked) {
      // already reacted — click toggles picker to change or remove
      setShowPicker((v) => !v)
    } else {
      setShowPicker((v) => !v)
    }
  }

  return (
    <>
      <div className="_feed_inner_timeline_reaction">
        {/* Reaction button */}
        <div className={styles.reactionWrap} ref={pickerRef}>
          <button
            type="button"
            className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${liked ? '_feed_reaction_active' : ''}`}
            onClick={handleReactionButtonClick}
            disabled={loading}
          >
            <span className="_feed_inner_timeline_reaction_link">
              <span className={styles.reactionInner}>
                {currentEmoji ? currentEmoji.svg : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                    <circle cx="9.5" cy="9.5" r="9" stroke="#666" />
                    <path stroke="#666" strokeLinecap="round" d="M6 12.5c1 .5 2 .7 3.5.7s2.5-.2 3.5-.7M7 7.5c0 .7.4 1.2.9 1.2s.9-.5.9-1.2M11.2 7.5c0 .7.4 1.2.9 1.2s.9-.5.9-1.2" />
                  </svg>
                )}
                <span className={liked ? styles.activeLabel : ''}>{currentEmoji ? currentEmoji.label : 'Reaction'}</span>
              </span>
            </span>
          </button>

          {showPicker && (
            <div className={styles.picker}>
              {EMOJIS.map((e) => (
                <button
                  key={e.type}
                  type="button"
                  className={`${styles.pickerBtn} ${reactionType === e.type ? styles.pickerBtnActive : ''}`}
                  onClick={() => sendReaction(e.type)}
                  title={e.label}
                >
                  {e.svg}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment */}
        <button
          type="button"
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
          onClick={onCommentToggle}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span className={styles.reactionInner}>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
              </svg>
              Comment
            </span>
          </span>
        </button>

        {/* Share */}
        <button type="button" className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span className={styles.reactionInner}>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      {likeCount > 0 && (
        <button type="button" className={styles.likersBtn} onClick={() => setShowLikers(true)}>
          {likeCount} reaction{likeCount !== 1 ? 's' : ''}
        </button>
      )}

      <LikedByModal isOpen={showLikers} onClose={() => setShowLikers(false)} fetchLikers={() => api.posts.likers(postId)} />
    </>
  )
}
