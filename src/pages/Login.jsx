import { useGoogleLogin } from '@react-oauth/google'
import Header from '../components/Header'

export default function Login({ onLogin }) {
  const login = useGoogleLogin({
    onSuccess: (response) => onLogin(response),
    onError: () => console.log('Login failed'),
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive'
    ].join(' ')
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
      <Header />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '80px',
        gap: '24px'
      }}>
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '12px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%'
        }}>
          <h2 style={{ marginBottom: '8px', color: '#1e3a5f' }}>Welcome</h2>
          <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>
            Sign in with your Hanover school account to access your portfolio.
          </p>
          <button
            onClick={() => login()}
            style={{
              background: '#1e3a5f',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '600',
              width: '100%'
            }}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}