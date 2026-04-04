'use client'

import { useRef, useState } from 'react'
import styles from './ImageUpload.module.css'

interface ImageUploadProps {
  onImageSelect: (base64: string) => void
  onClear: () => void
  preview: string | null
}

export default function ImageUpload({ onImageSelect, onClear, preview }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB')
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result
      if (typeof result === 'string') {
        onImageSelect(result)
      }
    }
    reader.readAsDataURL(file)
  }

  if (preview) {
    return (
      <div className={styles.preview}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Preview" className={styles.previewImg} />
        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => {
            onClear()
            if (inputRef.current) inputRef.current.value = ''
          }}
          aria-label="Remove image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path stroke="#fff" strokeLinecap="round" strokeWidth="1.5" d="M1 1l14 14M15 1L1 15" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.input}
        onChange={handleFileChange}
        aria-label="Upload image"
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
