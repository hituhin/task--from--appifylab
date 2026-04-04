import styles from './Spinner.module.css'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
  const sizeClass = size === 'sm' ? styles.small : size === 'lg' ? styles.large : styles.medium
  return <div className={`${styles.spinner} ${sizeClass}`} role="status" aria-label="Loading" />
}
