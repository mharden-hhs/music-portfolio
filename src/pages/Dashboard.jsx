import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Access Denied</h2>
        <p>Your account ({userInfo.email}) is not registered. Please contact your teacher.</p>
      </div>
    )
  }

  if (userInfo.role === 'teacher') {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {userInfo.name}</h1>
        <button onClick={onSignOut}>Sign Out</button>
        </div>
        <h2>Student Roster</h2>
        {userInfo.students.map(student => (
          <div
            key={student.email}
            onClick={() => {
              onSelectStudent(student)
              navigate(`/student/${encodeURIComponent(student.name)}`)
            }}
            style={{ padding: '12px', margin: '8px 0', background: '#f5f5f5', borderRadius: '8px', cursor: 'pointer' }}
          >
            <strong>{student.name}</strong>
            <p style={{ margin: 0 }}>{student.instrument} — Grade {student.grade}</p>
          </div>
        ))}
      </div>
    )
  }
}