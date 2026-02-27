import axios from 'axios'

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID

export async function getStudents(accessToken) {
  const response = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Students`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  const rows = response.data.values
  return rows.slice(1).map(row => ({
    name: row[0],
    email: row[1],
    grade: row[2],
    instrument: row[3],
    folderId: row[4]
  }))
}

export async function getTeachers(accessToken) {
  const response = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Teachers`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  const rows = response.data.values
  return rows.slice(1).map(row => ({
    name: row[0],
    email: row[1]
  }))
}