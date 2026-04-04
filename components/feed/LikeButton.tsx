'use client'

import { useLike } from '@/hooks/useLike'
import styles from './LikeButton.module.css'

interface LikeButtonProps {
  initialLiked: boolean
  initialCount: number
  toggleFn: () => Promise<{ liked: boolean; count: number }>
  onCountClick?: () => void
  showCount?: boolean
  variant?: 'action' | 'inline'
}

export default function LikeButton({
  initialLiked,
  initialCount,
  toggleFn,
  onCountClick,
  showCount = true,
  variant = 'action',
}: LikeButtonProps) {
  const { liked, count, toggle, isLoading } = useLike({ initialLiked, initialCount, toggleFn })

  if (variant === 'inline') {
    return (
      <span className={styles.inlineWrap}>
        <button
          type="button"
          className={`${styles.inlineBtn} ${liked ? styles.liked : ''}`}
          onClick={toggle}
          disabled={isLoading}
        >
          Like
        </button>
        {showCount && count > 0 && (
          <button
            type="button"
            className={styles.countBtn}
            onClick={onCountClick}
          >
            {count}
          </button>
        )}
      </span>
    )
  }

  return (
    <button
      type="button"
      className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${liked ? '_feed_reaction_active' : ''} ${styles.actionBtn}`}
      onClick={toggle}
      disabled={isLoading}
    >
      <span className="_feed_inner_timeline_reaction_link">
        <span>
          {liked ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
              <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
              <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
              <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
              <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
              <circle cx="9.5" cy="9.5" r="9" stroke="#666" />
              <path stroke="#666" strokeLinecap="round" d="M6 12.5c1 .5 2 .7 3.5.7s2.5-.2 3.5-.7M7 7.5c0 .7.4 1.2.9 1.2s.9-.5.9-1.2M11.2 7.5c0 .7.4 1.2.9 1.2s.9-.5.9-1.2" />
            </svg>
          )}
          {showCount ? `Like${count > 0 ? ` (${count})` : ''}` : 'Like'}
        </span>
      </span>
    </button>
  )
}
