import styles from './LeftSidebar.module.css'

interface LeftSidebarProps {
  currentUser: { id: string; firstName: string; lastName: string }
}

export default function LeftSidebar({ currentUser: _currentUser }: LeftSidebarProps) {
  return (
    <div className="_layout_left_sidebar_wrap">
      <div className="_layout_left_sidebar_inner">
        <div className={`_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area ${styles.card}`}>
          <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
          <ul className="_left_inner_area_explore_list">
            <li className="_left_inner_area_explore_item _explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path fill="#377DFF" d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10 10-4.478 10-10S15.522 0 10 0zm1.25 15h-2.5v-5h2.5v5zm0-7.5h-2.5V5h2.5v2.5z" />
                </svg>
                Learning
              </a>
              <span className="_left_inner_area_explore_link_txt">New</span>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="9" stroke="#377DFF" strokeWidth="1.5" />
                  <path stroke="#377DFF" strokeLinecap="round" strokeWidth="1.5" d="M10 6v4l3 3" />
                </svg>
                Events
              </a>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path stroke="#377DFF" strokeLinecap="round" strokeWidth="1.5" d="M10 2a6 6 0 100 12A6 6 0 0010 2zm0 14v2M6 18h8" />
                </svg>
                Find Friends
              </a>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <rect x="1" y="3" width="18" height="14" rx="2" stroke="#377DFF" strokeWidth="1.5" />
                  <path stroke="#377DFF" strokeLinecap="round" strokeWidth="1.5" d="M1 7h18" />
                </svg>
                Groups
              </a>
            </li>
            <li className="_left_inner_area_explore_item _explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path fill="#377DFF" d="M10 1l2.245 6.91H19.51l-5.878 4.27 2.245 6.91L10 14.82l-5.878 4.27 2.245-6.91L.49 7.91h7.265z" />
                </svg>
                Gaming
              </a>
              <span className="_left_inner_area_explore_link_txt">New</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="_layout_left_sidebar_inner">
        <div className={`_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area ${styles.card}`}>
          <div className="_left_inner_area_suggest_content _mar_b24">
            <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
            <span className="_left_inner_area_suggest_content_txt">
              <a className="_left_inner_area_suggest_content_txt_link" href="#0">See All</a>
            </span>
          </div>
          <p className={styles.placeholder}>Connect with new people.</p>
        </div>
      </div>

      <div className="_layout_left_sidebar_inner">
        <div className={`_padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area ${styles.card}`}>
          <div className="_mar_b24">
            <h4 className="_title5">Upcoming Events</h4>
          </div>
          <p className={styles.placeholder}>No upcoming events.</p>
        </div>
      </div>
    </div>
  )
}
