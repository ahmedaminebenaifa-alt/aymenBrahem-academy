import React from 'react';

const WelcomeBanner = ({ studentAge }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e8f5e9', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', borderRight: '6px solid #2e7d32' }}>
      <div>
        <h2 style={{ margin: 0, color: '#1b5e20' }}>مرحباً بك في لوحة التعلم الخاصة بك 👋</h2>
        <p style={{ margin: '0.5rem 0 0 0', color: '#4caf50', fontSize: '0.95rem' }}>إليك كافة المناهج والبرامج المتاحة المتوافقة معك.</p>
      </div>
      {studentAge && (
        <div style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          عمرك الحالي: {studentAge} سنة 🎯
        </div>
      )}
    </div>
  );
};

export default WelcomeBanner;