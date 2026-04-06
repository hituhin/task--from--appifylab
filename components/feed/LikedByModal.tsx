'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import styles from './LikedByModal.module.css'

interface User {
  id: string
  firstName: string
  lastName: string
}

interface LikedByModalProps {
  isOpen: boolean
  onClose: () => void
  fetchLikers: () => Promise<{ users: User[] }>
}

export default function LikedByModal({ isOpen, onClose, fetchLikers }: LikedByModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    setIsLoading(true)
    fetchLikers()
      .then((data) => { if (!cancelled) setUsers(data.users ?? []) })
      .catch(() => { if (!cancelled) setUsers([]) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [isOpen, fetchLikers])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Liked by">
      {isLoading ? (
        <div className={styles.center}>
          <Spinner />
        </div>
      ) : users.length === 0 ? (
        <p className={styles.empty}>No likes yet.</p>
      ) : (
        <ul className={styles.list}>
          {users.map((user) => (
            <li key={user.id} className={styles.item}>
              <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" />
              <span className={styles.name}>
                {user.firstName} {user.lastName}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
