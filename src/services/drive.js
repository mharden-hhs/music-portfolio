import axios from 'axios'

export async function getFolderContents(accessToken, folderId) {
  const response = await axios.get(
    `https://www.googleapis.com/drive/v3/files`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, webContentLink, webViewLink)',
      }
    }
  )
  return response.data.files
}

export async function getSubfolders(accessToken, rootFolderId) {
  const response = await axios.get(
    `https://www.googleapis.com/drive/v3/files`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        q: `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id, name)',
      }
    }
  )
  return response.data.files
}

export async function uploadFile(accessToken, folderId, file) {
  const metadata = {
    name: file.name,
    parents: [folderId]
  }

  const form = new FormData()
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
  form.append('file', file)

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form
    }
  )

  if (!response.ok) throw new Error('Upload failed')
  return response.json()
}

export async function deleteFile(accessToken, fileId) {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  )
  if (!response.ok) {
    const text = await response.text()
    console.error('Delete error details:', text)
    throw new Error('Delete failed')
  }
}