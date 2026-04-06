'use client'

import { useState } from 'react'
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
  likes: { userId: string; reactionType?: string }[]
}

interface PostCardProps {
  post: PostData
  currentUser: { id: string; firstName: string; lastName: string }
  onDelete: (postId: string) => void
}

export default function PostCard({ post, currentUser, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [commentCount, setCommentCount] = useState(post._count.comments)

  const isOwn = post.authorId === currentUser.id
  const myLike = post.likes.find((l) => l.userId === currentUser.id)
  const initialLiked = !!myLike
  const initialReactionType = myLike?.reactionType ?? null

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    setShowMenu(false)
    await api.posts.delete(post.id)
    onDelete(post.id)
  }

  return (
    <div className={`_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16 ${styles.card}`}>
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        {/* Post header */}
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/post_img.png" alt={post.author.firstName} className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {post.author.firstName} {post.author.lastName}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {formatDate(post.createdAt)} .{' '}
                {post.visibility === 'PRIVATE'
                  ? <span className={styles.privateBadge}>Private</span>
                  : <a href="#0">Public</a>}
              </p>
            </div>
          </div>

          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button type="button" className="_feed_timeline_post_dropdown_link" onClick={() => setShowMenu(!showMenu)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
            {showMenu && (
              <div className={`_feed_timeline_dropdown _timeline_dropdown show ${styles.dropdown}`} onClick={() => setShowMenu(false)}>
                <ul className="_feed_timeline_dropdown_list">
                  <li className="_feed_timeline_dropdown_item">
                    <a href="#0" className="_feed_timeline_dropdown_link">
                      <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" /></svg></span>
                      Save Post
                    </a>
                  </li>
                  <li className="_feed_timeline_dropdown_item">
                    <a href="#0" className="_feed_timeline_dropdown_link">
                      <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5" /></svg></span>
                      Hide Post
                    </a>
                  </li>
                  {isOwn && (
                    <>
                      <li className="_feed_timeline_dropdown_item">
                        <a href="#0" className="_feed_timeline_dropdown_link">
                          <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75" /><path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" /></svg></span>
                          Edit Post
                        </a>
                      </li>
                      <li className="_feed_timeline_dropdown_item">
                        <a href="#0" className="_feed_timeline_dropdown_link" onClick={(e) => { e.preventDefault(); handleDelete() }}>
                          <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" /></svg></span>
                          Delete Post
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {post.content && <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>}
        {post.imageUrl && (
          <div className="_feed_inner_timeline_image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.imageUrl} alt="Post" className="_time_img" />
          </div>
        )}
      </div>

      {/* Total reacts row */}
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          {likeCount > 0 && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/react_img1.png" alt="" className="_react_img1" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/react_img2.png" alt="" className="_react_img" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/react_img3.png" alt="" className="_react_img _rect_img_mbl_none" />
              <p className="_feed_inner_timeline_total_reacts_para">{likeCount}</p>
            </>
          )}
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          {commentCount > 0 && (
            <p className="_feed_inner_timeline_total_reacts_para1">
              <a href="#0" onClick={(e) => { e.preventDefault(); setShowComments(true) }}>
                <span>{commentCount}</span> Comment{commentCount !== 1 ? 's' : ''}
              </a>
            </p>
          )}
          <p className="_feed_inner_timeline_total_reacts_para2"><span>0</span> Share</p>
        </div>
      </div>

      {/* Reaction / Comment / Share buttons */}
      <PostActions
        postId={post.id}
        initialLiked={initialLiked}
        initialReactionType={initialReactionType}
        initialLikeCount={likeCount}
        onCommentToggle={() => setShowComments((v) => !v)}
        onLikeChange={setLikeCount}
      />

      {/* Comment section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          currentUser={currentUser}
          onCommentCountChange={setCommentCount}
        />
      )}
    </div>
  )
}
