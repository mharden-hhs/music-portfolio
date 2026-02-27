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
    
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      {userInfo?.role === 'teacher' && (
        <button onClick={() => navigate('/dashboard')}>← Back to Roster</button>
      )}
      <button onClick={onSignOut}>Sign Out</button>
      <h1>{student.name}</h1>
      <p>{student.instrument} — Grade {student.grade}</p>

      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab ? '#1a1a2e' : '#eee',
              color: activeTab === tab ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : files.length === 0 ? (
        <p>No {activeTab.toLowerCase()} found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {files.map(file => (
            <FileItem key={file.id} file={file} activeTab={activeTab} accessToken={auth.access_token} />
          ))}
        </div>
      )}
    </div>
  )
}

function FileItem({ file, activeTab, accessToken }) {
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioLoading, setAudioLoading] = useState(true)

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

  if (activeTab === 'Recordings') {
    return (
      <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>{file.name}</p>
        {audioLoading ? (
          <p>Loading audio...</p>
        ) : audioUrl ? (
          <audio controls src={audioUrl} style={{ width: '100%' }} />
        ) : (
          <a href={file.webViewLink} target="_blank" rel="noreferrer">
            Open in Google Drive
          </a>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{file.name}</span>
      <a href={file.webViewLink} target="_blank" rel="noreferrer">
        Open
      </a>
    </div>
  )
}