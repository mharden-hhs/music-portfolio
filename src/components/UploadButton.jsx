import { useRef, useState } from 'react'
import { uploadFile } from '../services/drive'

export default function UploadButton({ accessToken, folderId, accept, label, onUploadComplete }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadFile(accessToken, folderId, file)
      onUploadComplete()
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button
        onClick={() => inputRef.current.click()}
        disabled={uploading}
        style={{
          background: uploading ? '#999' : '#f0c040',
          color: '#1e3a5f',
          border: 'none',
          padding: '8px 20px',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '14px',
          cursor: uploading ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? 'Uploading...' : label}
      </button>
    </div>
  )
}