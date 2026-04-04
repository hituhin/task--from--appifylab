'use client'

import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import PostActions from './PostActions'
import CommentSection from './CommentSection'
import { formatDate } from '@/lib/utils'
import { api } from '@/lib/api'
import styles from './PostCard.module.css'

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

interface PostCardProps {
  post: PostData
  currentUser: { id: string; firstName: string; lastName: string }
  onDelete: (postId: string) => void
}

export default function PostCard({ post, currentUser, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const isOwn = post.authorId === currentUser.id
  const initialLiked = post.likes.some((l) => l.userId === currentUser.id)

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    setShowMenu(false)
    await api.posts.delete(post.id)
    onDelete(post.id)
  }

  return (
    <div className={`_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16 ${styles.card}`}>
      <div className={`_feed_inner_timeline_content _padd_r24 _padd_l24 ${styles.content}`}>
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className={`_feed_inner_timeline_post_box_image ${styles.avatarWrap}`}>
              <Avatar
                firstName={post.author.firstName}
                lastName={post.author.lastName}
                size="md"
              />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {post.author.firstName} {post.author.lastName}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {formatDate(post.createdAt)} .{' '}
                {post.visibility === 'PRIVATE' ? (
                  <span className={styles.privateBadge}>Private</span>
                ) : (
                  <a href="#0">Public</a>
                )}
              </p>
            </div>
          </div>

          {isOwn && (
            <div className="_feed_inner_timeline_post_box_dropdown">
              <div className="_feed_timeline_post_dropdown">
                <button
                  type="button"
                  className="_feed_timeline_post_dropdown_link"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                  </svg>
                </button>
              </div>
              {showMenu && (
                <div className={`_feed_timeline_dropdown _timeline_dropdown show ${styles.dropdown}`}>
                  <ul className="_feed_timeline_dropdown_list">
                    <li className="_feed_timeline_dropdown_item">
                      <button
                        type="button"
                        className={`_feed_timeline_dropdown_link ${styles.dropBtn}`}
                        onClick={handleDelete}
                      >
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                            <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" />
                          </svg>
                        </span>
                        Delete Post
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {post.content && (
          <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        )}

        {post.imageUrl && (
          <div className="_feed_inner_timeline_image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.imageUrl} alt="Post" className="_time_img" />
          </div>
        )}
      </div>

      <div className={`_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26 ${styles.reacts}`}>
        <div className="_feed_inner_timeline_total_reacts_image">
          {post._count.likes > 0 && (
            <p className="_feed_inner_timeline_total_reacts_para">
              {post._count.likes} like{post._count.likes !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          {post._count.comments > 0 && (
            <p className="_feed_inner_timeline_total_reacts_para1">
              <button
                type="button"
                className={styles.commentCountBtn}
                onClick={() => setShowComments(!showComments)}
              >
                <span>{post._count.comments}</span> Comment{post._count.comments !== 1 ? 's' : ''}
              </button>
            </p>
          )}
        </div>
      </div>

      <PostActions
        postId={post.id}
        initialLiked={initialLiked}
        initialLikeCount={post._count.likes}
        initialCommentCount={post._count.comments}
        onCommentToggle={() => setShowComments(!showComments)}
      />

      {showComments && (
        <div className="_padd_r24 _padd_l24">
          <CommentSection
            postId={post.id}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  )
}
