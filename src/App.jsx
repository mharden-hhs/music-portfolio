import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudentProfile from './pages/StudentProfile'
import { detectRole } from './services/auth'

export default function App() {
  const [auth, setAuth] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const basename = import.meta.env.DEV ? "/" : "/music-portfolio"

  async function handleLogin(authResponse) {
    setLoading(true)
    try {
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${authResponse.access_token}` }
      })
      const profile = await profileRes.json()
      const roleInfo = await detectRole(authResponse.access_token, profile.email)
      setAuth(authResponse)
      setUserInfo({ ...profile, ...roleInfo })
    } catch (err) {
      console.error('Error during login:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleSignOut() {
  setAuth(null)
  setUserInfo(null)
  setSelectedStudent(null)
}

  if (loading) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</p>

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route
          path="/" element={auth ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />
        <Route path="/dashboard" element={auth ? <Dashboard userInfo={userInfo} onSelectStudent={setSelectedStudent} onSignOut={handleSignOut} /> : <Navigate to="/" />}
        />
<Route
  path="/student/:name"
  element={auth && selectedStudent ? <StudentProfile auth={auth} student={selectedStudent} userInfo={userInfo} onSignOut={handleSignOut} /> : <Navigate to="/dashboard" />}
/>
      </Routes>
    </BrowserRouter>
  )
}
