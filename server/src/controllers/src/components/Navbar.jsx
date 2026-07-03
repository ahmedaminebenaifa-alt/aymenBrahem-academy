import React from 'react';

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    setUser(null);
  };

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '0.8rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      borderBottom: '1px solid #edf2f7',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      direction: 'rtl',
      fontFamily: 'sans-serif'
    }}>
      {/* 🌟 Premium Branding Logo (SVG) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <svg 
          width="28" height="28" viewBox="0 0 24 24" fill="none" 
          stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
        <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#1a202c', letterSpacing: '-0.5px' }}>
          أكاديمية <span style={{ color: '#2e7d32' }}>أيمن براهم</span>
        </span>
      </div>

      {/* User Information & Role Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2d3748' }}>
              {user?.name || user?.email?.split('@')[0]}
            </div>
            
            {/* SVG Role Badge */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '0.2rem 0.6rem',
              borderRadius: '12px',
              backgroundColor: isAdmin ? '#fff5f5' : '#e8f5e9',
              color: isAdmin ? '#e53e3e' : '#2e7d32',
              border: `1px solid ${isAdmin ? '#fed7d7' : '#c8e6c9'}`,
              marginTop: '0.2rem'
            }}>
              {isAdmin ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  مدير المنصة
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                  </svg>
                  حساب الطالب
                </>
              )}
            </span>
          </div>
          
          {/* Circular Placeholder Avatar */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#edf2f7',
            color: '#4a5568',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            {(user?.name || user?.email || 'U')[0].toUpperCase()}
          </div>
        </div>

        {/* Separator Line */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }}></div>

        {/* Action Logout Button with SVG */}
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'transparent',
            color: '#718096',
            border: '1px solid #cbd5e0',
            padding: '0.45rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fff5f5';
            e.currentTarget.style.color = '#e53e3e';
            e.currentTarget.style.borderColor = '#fed7d7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#718096';
            e.currentTarget.style.borderColor = '#cbd5e0';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          تسجيل الخروج
        </button>
      </div>
    </nav>
  );
};

export default Navbar;