export default function Header({ onSignOut }) {
  return (
    <header style={{
      background: '#1e3a5f',
      padding: '12px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
       <img
          src={import.meta.env.DEV ? '/logo.png' : '/music-portfolio/logo.png'}
          alt="Hanover Hawks"
          style={{ height: '52px', mixBlendMode: 'screen' }}
        />
        <div>
          <div style={{ color: '#f0c040', fontWeight: '700', fontSize: '18px', letterSpacing: '0.5px' }}>
            HANOVER HIGH SCHOOL
          </div>
          <div style={{ color: '#cce0ff', fontSize: '13px', letterSpacing: '1px' }}>
            MUSIC DEPARTMENT PORTFOLIO
          </div>
        </div>
      </div>
      {onSignOut && (
        <button
          onClick={onSignOut}
          style={{
            background: 'transparent',
            border: '1px solid #f0c040',
            color: '#f0c040',
            padding: '6px 16px',
            borderRadius: '4px',
            fontSize: '13px',
            letterSpacing: '0.5px'
          }}
        >
          Sign Out
        </button>
      )}
    </header>
  )
}