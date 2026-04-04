'use client'

import { useCallback, useEffect, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import RightSidebar from '@/components/layout/RightSidebar'
import CreatePost from './CreatePost'
import PostList from './PostList'
import StoryRow from './StoryRow'
import { usePosts, PostData } from '@/hooks/usePosts'
import styles from './FeedPage.module.css'

interface FeedPageProps {
  initialPosts: PostData[]
  currentUser: { id: string; firstName: string; lastName: string }
}

export default function FeedPage({ initialPosts, currentUser }: FeedPageProps) {
  const { posts, setPosts, loadMore, hasMore, isLoading } = usePosts(initialPosts)
  const layoutRef = useRef<HTMLDivElement>(null)
  const darkModeRef = useRef(false)

  const handleDarkModeToggle = useCallback(() => {
    darkModeRef.current = !darkModeRef.current
    const layout = layoutRef.current
    if (!layout) return
    if (darkModeRef.current) {
      layout.classList.add('_dark_wrapper')
    } else {
      layout.classList.remove('_dark_wrapper')
    }
  }, [])

  const handlePostCreated = useCallback(
    (post: PostData) => {
      setPosts((prev) => [post, ...prev])
    },
    [setPosts],
  )

  const handlePostDelete = useCallback(
    (postId: string) => {
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    },
    [setPosts],
  )

  // Prevent scroll on the outer layout – middle column scrolls
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div ref={layoutRef} className={`_layout _layout_main_wrapper ${styles.wrapper}`}>
      {/* Dark Mode Toggle */}
      <div className="_layout_mode_swithing_btn">
        <button
          type="button"
          className="_layout_swithing_btn_link"
          onClick={handleDarkModeToggle}
        >
          <div className="_layout_swithing_btn">
            <div className="_layout_swithing_btn_round"></div>
          </div>
          <div className="_layout_change_btn_ic1">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" fill="none" viewBox="0 0 11 16">
              <path fill="#fff" d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997z" />
            </svg>
          </div>
          <div className="_layout_change_btn_ic2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4.389" stroke="#fff" />
              <path stroke="#fff" strokeLinecap="round" d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05" />
            </svg>
          </div>
        </button>
      </div>

      <div className="_main_layout">
        {/* Navbar */}
        <Navbar
          currentUser={currentUser}
          onDarkModeToggle={handleDarkModeToggle}
          isDarkMode={false}
        />

        {/* Main Content */}
        <div className={`_layout_inner_wrap container _custom_container ${styles.inner}`}>
          <div className="row">
            {/* Left Sidebar */}
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
              <LeftSidebar currentUser={currentUser} />
            </div>

            {/* Middle Feed */}
            <div className={`col-xl-6 col-lg-6 col-md-12 col-sm-12 ${styles.middle}`}>
              <div className="_layout_middle_wrap">
                <div className="_layout_middle_inner">
                  <StoryRow />

                  <CreatePost
                    currentUser={currentUser}
                    onPostCreated={handlePostCreated}
                  />

                  <PostList
                    posts={posts}
                    currentUser={currentUser}
                    onDelete={handlePostDelete}
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
