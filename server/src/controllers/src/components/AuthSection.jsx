import React, { useState } from 'react';
import './AuthSection.css'

export default function AuthSection({ setUser, authView, setAuthView }) {
  const [formData, setFormData] = useState({ email: '', password: '', birthDate: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const endpoint = authView === 'signup' ? '/users' : '/login';

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'حدث خطأ ما');

      if (authView === 'login') {
        localStorage.setItem('token', data.token);
        setUser(data.user); // تسجيل الدخول وتحويل الواجهة فوراً
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage('🎉 تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setAuthView('login');
      }
      setFormData({ email: '', password: '', birthDate: '' });
    } catch (err) {
      if (err.message.includes('email or password')) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else {
        setError('فشلت العملية. يرجى التحقق من البيانات والمحاولة مرة أخرى.');
      }
    }
  };

  return (
    <section id="academy-auth-section" className="isolated-auth-footer-section">
      <div className="auth-section-intro">
        <div className="islamic-ornament-small">❖</div>
        <h2>البوابة الأكاديمية الرقمية</h2>
        <p>منصتك الخاصة لمتابعة مسارك العلمي، وتصفح المناهج، وتطوير مهاراتك باستمرار. يرجى تسجيل دخولك أو فتح ملف طالب جديد للبدء.</p>
      </div>

      <div className="auth-card-isolated">
        <div className="auth-tab-triggers">
          <button className={`tab-btn ${authView === 'login' ? 'active' : ''}`} onClick={() => { setAuthView('login'); setError(''); setMessage(''); }}>
            <svg className="tab-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9.243 2 7 4.243 7 7V10H6C4.895 10 4 10.895 4 12V20C4 21.105 4.895 22 6 22H18C19.105 22 20 21.105 20 20V12C20 10.895 19.105 10 18 10H17V7C17 4.243 14.757 2 12 2ZM9 7C9 5.343 10.343 4 12 4C13.657 4 15 5.343 15 7V10H9V7ZM12 18C10.895 18 10 17.105 10 16C10 14.895 10.895 14 12 14C13.105 14 14 14.895 14 16C14 17.105 13.105 18 12 18Z" fill="currentColor"/>
            </svg>
            بوابة الدخول
          </button>
          <button className={`tab-btn ${authView === 'signup' ? 'active' : ''}`} onClick={() => { setAuthView('signup'); setError(''); setMessage(''); }}>
            <svg className="tab-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM20 8V14M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            فتح حساب جديد
          </button>
        </div>

        <form key={authView} onSubmit={handleSubmit} className="auth-form-footer form-transition-wrapper">
          <div className="form-group-footer">
            <label>البريد الإلكتروني للطلب</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="name@academy.com" />
          </div>
          <div className="form-group-footer">
            <label>كلمة المرور الخاصة بالحساب</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
          </div>
          {authView === 'signup' && (
            <div className="form-group-footer expand-field">
              <label>تاريخ ميلاد الطالب (لتحديد الفئة العمرية للكورسات)</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
            </div>
          )}
          <button type="submit" className="submit-btn-footer">
            {authView === 'signup' ? 'تأكيد تسجيل الحساب' : 'دخول لغرفة العلم'}
            <svg className="btn-arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
        {message && <p className="success-msg-footer">{message}</p>}
        {error && <p className="error-msg-footer">{error}</p>}
      </div>
    </section>
  );
}