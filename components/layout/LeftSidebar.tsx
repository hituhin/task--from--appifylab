import styles from './LeftSidebar.module.css'

interface LeftSidebarProps {
  currentUser: { id: string; firstName: string; lastName: string }
}

const SUGGESTED = [
  { img: '/assets/images/people1.png', name: 'Steve Jobs', role: 'CEO of Apple' },
  { img: '/assets/images/people2.png', name: 'Ryan Roslansky', role: 'CEO of LinkedIn' },
  { img: '/assets/images/people3.png', name: 'Karim Saif', role: 'Software Engineer' },
]

const EVENTS = [
  { img: '/assets/images/feed_event1.png', title: 'No more terrorism no more cry', date: '10', month: 'Jul', going: '17 People Going' },
  { img: '/assets/images/feed_event1.png', title: 'Tech Conference 2026', date: '22', month: 'Aug', going: '42 People Going' },
]

export default function LeftSidebar({ currentUser: _currentUser }: LeftSidebarProps) {
  return (
    <div className="_layout_left_sidebar_wrap">
      {/* Explore */}
      <div className="_layout_left_sidebar_inner">
        <div className={`_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area ${styles.card}`}>
          <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
          <ul className="_left_inner_area_explore_list">
            <li className="_left_inner_area_explore_item _explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path fill="#666" d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10 10-4.478 10-10S15.522 0 10 0zm1.25 15h-2.5v-5h2.5v5zm0-7.5h-2.5V5h2.5v2.5z" />
                </svg>
                Learning
              </a>
              <span className="_left_inner_area_explore_link_txt">New</span>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
                  <path fill="#666" d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698zm3.546 8.283H4.004l.001 6.621c0 2.325 1.137 3.616 3.183 3.697l.207.004h7.132c2.184 0 3.39-1.271 3.39-3.63v-6.692z" />
                </svg>
                Events
              </a>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
                  <path fill="#666" d="M9.032 14.456l.297.002c4.404.041 6.907 1.03 6.907 3.678 0 2.586-2.383 3.573-6.615 3.654l-.589.005c-4.588 0-7.203-.972-7.203-3.68 0-2.704 2.604-3.659 7.203-3.659zm0 1.5l-.308.002c-3.645.038-5.523.764-5.523 2.157 0 1.44 1.99 2.18 5.831 2.18 3.847 0 5.832-.728 5.832-2.159 0-1.44-1.99-2.18-5.832-2.18zm8.53-8.037c.347 0 .634.282.679.648l.006.102v1.255h1.185c.38 0 .686.336.686.75 0 .38-.258.694-.593.743l-.093.007h-1.185v1.255c0 .414-.307.75-.686.75-.347 0-.634-.282-.68-.648l-.005-.102-.001-1.255h-1.183c-.379 0-.686-.336-.686-.75 0-.38.258-.694.593-.743l.093-.007h1.183V8.669c0-.414.308-.75.686-.75zM9.031 2c2.698 0 4.864 2.369 4.864 5.319 0 2.95-2.166 5.318-4.864 5.318-2.697 0-4.863-2.369-4.863-5.318C4.17 4.368 6.335 2 9.032 2zm0 1.5c-1.94 0-3.491 1.697-3.491 3.819 0 2.12 1.552 3.818 3.491 3.818 1.94 0 3.492-1.697 3.492-3.818 0-2.122-1.551-3.818-3.492-3.818z" />
                </svg>
                Find Friends
              </a>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Groups
              </a>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                </svg>
                Bookmarks
              </a>
            </li>
            <li className="_left_inner_area_explore_item _explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path fill="#666" d="M10 1l2.245 6.91H19.51l-5.878 4.27 2.245 6.91L10 14.82l-5.878 4.27 2.245-6.91L.49 7.91h7.265z" />
                </svg>
                Gaming
              </a>
              <span className="_left_inner_area_explore_link_txt">New</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Suggested People */}
      <div className="_layout_left_sidebar_inner">
        <div className={`_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area ${styles.card}`}>
          <div className="_left_inner_area_suggest_content _mar_b24">
            <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
            <span className="_left_inner_area_suggest_content_txt">
              <a className="_left_inner_area_suggest_content_txt_link" href="#0">See All</a>
            </span>
          </div>
          {SUGGESTED.map((p, i) => (
            <div key={i} className="_left_inner_area_suggest_info">
              <div className="_left_inner_area_suggest_info_box">
                <div className="_left_inner_area_suggest_info_image">
                  <a href="#0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} className="_info_img" />
                  </a>
                </div>
                <div className="_left_inner_area_suggest_info_txt">
                  <a href="#0"><h4 className="_left_inner_area_suggest_info_title">{p.name}</h4></a>
                  <p className="_left_inner_area_suggest_info_para">{p.role}</p>
                </div>
              </div>
              <div className="_left_inner_area_suggest_info_link">
                <a href="#0" className="_info_link">Connect</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="_layout_left_sidebar_inner">
        <div className={`_left_inner_event_card_wrap _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area ${styles.card}`}>
          <div className="_mar_b24">
            <h4 className="_title5">Upcoming Events</h4>
          </div>
          {EVENTS.map((e, i) => (
            <div key={i} className="_left_inner_event_card_link">
              <div className="_left_inner_event_card">
                <div className="_left_inner_event_card_iamge">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.img} alt={e.title} className="_card_img" />
                </div>
                <div className="_left_inner_event_card_content">
                  <div className="_left_inner_card_date">
                    <p className="_left_inner_card_date_para">{e.date}</p>
                    <p className="_left_inner_card_date_para1">{e.month}</p>
                  </div>
                  <div className="_left_inner_card_txt">
                    <h4 className="_left_inner_event_card_title">{e.title}</h4>
                  </div>
                </div>
                <hr className="_underline" />
                <div className="_left_inner_event_bottom">
                  <p className="_left_iner_event_bottom">{e.going}</p>
                  <a href="#0" className="_left_iner_event_bottom_link">Going</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
