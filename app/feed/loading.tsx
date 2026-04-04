import styles from './loading.module.css'

export default function FeedLoading() {
  return (
    <div className={`_layout _layout_main_wrapper ${styles.wrapper}`}>
      <div className={styles.center}>
        <div className={styles.spinner} />
        <p className={styles.text}>Loading feed...</p>
      </div>
    </div>
  )
}
