import { deleteFile } from '../services/drive'
import UploadButton from '../components/UploadButton'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSubfolders, getFolderContents } from '../services/drive'

const TABS = ['Recordings', 'Documents', 'Evaluations']

export default function StudentProfile({ auth, student, userInfo, onSignOut }) {
  const [folders, setFolders] = useState({})
  const [files, setFiles] = useState([])
  const [activeTab, setActiveTab] = useState('Recordings')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadFolders() {
      try {
        const subfolders = await getSubfolders(auth.access_token, student.folderId)
        const folderMap = {}
        subfolders.forEach(f => { folderMap[f.name] = f.id })
        setFolders(folderMap)
      } catch (err) {
        console.error('Error loading folders:', err)
      } finally {
        setLoading(false)
      }
    }
    loadFolders()
  }, [student, auth.access_token])

  useEffect(() => {
    if (!folders[activeTab]) return
    setLoading(true)
    getFolderContents(auth.access_token, folders[activeTab])
      .then(data => {
        setFiles(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading files:', err)
        setLoading(false)
      })
  }, [activeTab, folders, auth.access_token])

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
      <Header onSignOut={onSignOut} />
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        {userInfo?.role === 'teacher' && (
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#1e3a5f',
              fontSize: '14px',
              marginBottom: '16px',
              padding: '0',
              fontWeight: '600'
            }}
          >
            {'<-'} Back to Roster
          </button>
        )}

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          marginBottom: '24px'
        }}>
          <h1 style={{ color: '#1e3a5f', fontSize: '28px' }}>{student.name}</h1>
          <p style={{ color: '#666', marginTop: '4px' }}>{student.instrument} — Grade {student.grade}</p>
        </div>

       <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
  <div style={{ display: 'flex', gap: '8px' }}>
    {TABS.map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        style={{
          padding: '10px 20px',
          background: activeTab === tab ? '#1e3a5f' : 'white',
          color: activeTab === tab ? 'white' : '#1e3a5f',
          border: '1px solid #1e3a5f',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600'
        }}
      >
        {tab}
      </button>
    ))}
  </div>
  {activeTab === 'Recordings' && folders['Recordings'] && (
    <UploadButton
      accessToken={auth.access_token}
      folderId={folders['Recordings']}
      accept="audio/*"
      label="Upload Recording"
      onUploadComplete={() => {
        setFiles([])
        setLoading(true)
        getFolderContents(auth.access_token, folders['Recordings'])
          .then(data => { setFiles(data); setLoading(false) })
      }}
    />
  )}

  {activeTab === 'Documents' && folders['Documents'] && (
    <UploadButton
      accessToken={auth.access_token}
      folderId={folders['Documents']}
      accept=".pdf,.doc,.docx"
      label="Upload Document"
      onUploadComplete={() => {
        setFiles([])
        setLoading(true)
        getFolderContents(auth.access_token, folders['Documents'])
          .then(data => { setFiles(data); setLoading(false) })
      }}
    />
  )}
</div>

        {loading ? (
          <p style={{ color: '#666' }}>Loading...</p>
        ) : files.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#999',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
          }}>
            No {activeTab.toLowerCase()} found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {files.map(file => (
  <FileItem
    key={file.id}
    file={file}
    activeTab={activeTab}
    accessToken={auth.access_token}
    onDelete={(deletedId) => setFiles(files.filter(f => f.id !== deletedId))}
  />
))}
          </div>
        )}
      </div>
    </div>
  )
}

function FileItem({ file, activeTab, accessToken, onDelete }) {
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioLoading, setAudioLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (activeTab !== 'Recordings') return
    fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.blob())
      .then(blob => {
        setAudioUrl(URL.createObjectURL(blob))
        setAudioLoading(false)
      })
      .catch(() => setAudioLoading(false))
  }, [file.id, activeTab, accessToken])

  async function handleDelete() {
  if (!window.confirm(`Are you sure you want to delete "${file.name}"? This cannot be undone.`)) return
  setDeleting(true)
  try {
    await deleteFile(accessToken, file.id)
    onDelete(file.id)
  } catch (err) {
    console.error('Delete error:', err)
    alert('Delete failed. Please try again.')
    setDeleting(false)
  }
}

  if (activeTab === 'Recordings') {
    return (
      <div style={{
        background: 'white',
        padding: '16px 20px',
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <p style={{ fontWeight: '600', color: '#1a1a2e', margin: 0 }}>{file.name}</p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: 'transparent',
              border: '1px solid #cc0000',
              color: '#cc0000',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: deleting ? 'not-allowed' : 'pointer'
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
        {audioLoading ? (
          <p style={{ color: '#999', fontSize: '14px' }}>Loading audio...</p>
        ) : audioUrl ? (
          <audio controls src={audioUrl} style={{ width: '100%' }} />
        ) : (
          <a href={file.webViewLink} target="_blank" rel="noreferrer" style={{ color: '#1e3a5f' }}>
            Open in Google Drive
          </a>
        )}
      </div>
    )
  }

  return (
    <div style={{
      background: 'white',
      padding: '16px 20px',
      borderRadius: '8px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ fontWeight: '500', color: '#1a1a2e' }}>{file.name}</span>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <a href={file.webViewLink} target="_blank" rel="noreferrer" style={{ color: '#1e3a5f', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
          Open
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            background: 'transparent',
            border: '1px solid #cc0000',
            color: '#cc0000',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: deleting ? 'not-allowed' : 'pointer'
          }}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}