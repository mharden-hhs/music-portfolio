import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function Dashboard({ userInfo, onSelectStudent, onSignOut }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (userInfo?.role === 'student') {
      onSelectStudent(userInfo.profile)
      navigate(`/student/${encodeURIComponent(userInfo.profile.name)}`)
    }
  }, [userInfo, onSelectStudent, navigate])

  if (!userInfo) return <p>Loading...</p>

  if (userInfo.role === 'unknown') {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
        <Header onSignOut={onSignOut} />
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <h2 style={{ color: '#1e3a5f' }}>Access Denied</h2>
          <p style={{ color: '#666', marginTop: '8px' }}>
            Your account ({userInfo.email}) is not registered. Please contact your teacher.
          </p>
        </div>
      </div>
    )
  }

  if (userInfo.role === 'teacher') {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
        <Header onSignOut={onSignOut} />
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
          <h2 style={{ color: '#1e3a5f', marginBottom: '20px' }}>Student Roster</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {userInfo.students.map(student => (
              <div
                key={student.email}
                onClick={() => {
                  onSelectStudent(student)
                  navigate(`/student/${encodeURIComponent(student.name)}`)
                }}
                style={{
                  background: 'white',
                  padding: '16px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'box-shadow 0.2s',
                  borderLeft: '4px solid #1e3a5f'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '16px', color: '#1a1a2e' }}>{student.name}</div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>{student.instrument} — Grade {student.grade}</div>
                </div>
                <span style={{ color: '#1e3a5f', fontSize: '20px' }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}