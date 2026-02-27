import { useGoogleLogin } from '@react-oauth/google'

export default function Login({ onLogin }) {
  const login = useGoogleLogin({
    onSuccess: (response) => onLogin(response),
    onError: () => console.log('Login failed'),
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/drive.readonly'
    ].join(' ')
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h1>HHS Music Portfolio</h1>
      <p>Sign in with your school Google account</p>
      <button onClick={() => login()}>
        Sign in with Google
      </button>
    </div>
  )
}