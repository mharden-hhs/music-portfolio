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