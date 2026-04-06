import styles from './RightSidebar.module.css'

const YOU_MIGHT_LIKE = [
  { img: '/assets/images/Avatar.png', name: 'Radovan SkillArena', role: 'Founder & CEO at Trophy' },
  { img: '/assets/images/people2.png', name: 'Ryan Roslansky', role: 'CEO of LinkedIn' },
  { img: '/assets/images/people1.png', name: 'Steve Jobs', role: 'CEO of Apple' },
]

const FRIENDS = [
  { img: '/assets/images/chat_profile.png', name: 'Alex Turner', online: true },
  { img: '/assets/images/chat_profile1.png', name: 'Maria Garcia', online: true },
  { img: '/assets/images/profile-1.png', name: 'John Smith', online: false },
  { img: '/assets/images/friend-req.png', name: 'Emma Wilson', online: true },
]

export default function RightSidebar() {
  return (
    <div className="_layout_right_sidebar_wrap">
      {/* You Might Like */}
      <div className="_layout_right_sidebar_inner">
        <div className={`_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area ${styles.card}`}>
          <div className="_right_inner_area_info_content _mar_b24">
            <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
            <span className="_right_inner_area_info_content_txt">
              <a className="_right_inner_area_info_content_txt_link" href="#0">See All</a>
            </span>
          </div>
          <hr className="_underline" />
          {YOU_MIGHT_LIKE.map((p, i) => (
            <div key={i} className="_right_inner_area_info_ppl">
              <div className="_right_inner_area_info_box">
                <div className="_right_inner_area_info_box_image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <a href="#0"><img src={p.img} alt={p.name} className="_ppl_img" /></a>
                </div>
                <div className="_right_inner_area_info_box_txt">
                  <a href="#0"><h4 className="_right_inner_area_info_box_title">{p.name}</h4></a>
                  <p className="_right_inner_area_info_box_para">{p.role}</p>
                </div>
              </div>
              <div className="_right_info_btn_grp">
                <button type="button" className="_right_info_btn_link">Ignore</button>
                <button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Friends */}
      <div className="_layout_right_sidebar_inner">
        <div className={`_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area ${styles.card}`}>
          <div className="_feed_top_fixed">
            <div className="_feed_right_inner_area_card_content _mar_b24">
              <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
              <span className="_feed_right_inner_area_card_content_txt">
                <a className="_feed_right_inner_area_card_content_txt_link" href="#0">See All</a>
              </span>
            </div>
            <form className="_feed_right_inner_area_card_form">
              <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                <circle cx="7" cy="7" r="6" stroke="#666" />
                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
              <input className="form-control me-2 _feed_right_inner_area_card_form_inpt" type="search" placeholder="Search friends" aria-label="Search friends" />
            </form>
          </div>
          <div className="_feed_bottom_fixed">
            {FRIENDS.map((f, i) => (
              <div key={i} className={`_right_inner_area_chat_info ${styles.friendItem}`}>
                <div className={`_right_inner_area_chat_image ${styles.avatarWrap}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.name} className="_chat_profile_img" />
                  {f.online && <span className={styles.onlineDot} />}
                </div>
                <div className="_right_inner_area_chat_txt">
                  <h4 className="_right_inner_area_chat_title">{f.name}</h4>
                  <p className={`_right_inner_area_chat_para ${styles.status}`}>{f.online ? 'Active now' : 'Offline'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
