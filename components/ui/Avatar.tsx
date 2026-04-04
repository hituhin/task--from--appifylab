import styles from './Avatar.module.css'
import { getInitials } from '@/lib/utils'

interface AvatarProps {
  firstName: string
  lastName: string
  imageUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
}

export default function Avatar({ firstName, lastName, imageUrl, size = 'md' }: AvatarProps) {
  const initials = getInitials(firstName, lastName)
  const sizeClass = size === 'sm' ? styles.small : size === 'lg' ? styles.large : styles.medium

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={`${firstName} ${lastName}`}
        className={`${styles.avatar} ${sizeClass}`}
      />
    )
  }

  return (
    <div className={`${styles.initials} ${sizeClass}`} aria-label={`${firstName} ${lastName}`}>
      {initials}
    </div>
  )
}
