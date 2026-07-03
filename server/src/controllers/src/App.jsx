import React, { useState, useEffect } from 'react';
import './index.css'; 

// Import your UI components
import LandingPage from './components/LandingPage';
import AuthSection from './components/AuthSection';
import Dashboard from './components/Dashboard'; 
import StudentDashboard from './components/StudentDashboard/StudentDashboard'; 
import Navbar from './components/Navbar';

function App() {
  // 1. Initialize state from localStorage so it stays logged in on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('academy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authView, setAuthView] = useState('login');

  // 2. Automatically save or clean up storage whenever the 'user' state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('academy_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('academy_user');
      localStorage.removeItem('token'); // Clears token on logout
    }
  }, [user]);

  // دالة النزول المريح للاستمارة
  const scrollToAuth = (viewType) => {
    setAuthView(viewType);
    const element = document.getElementById('academy-auth-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  if (user) {
    const isAdmin = user.role && user.role.toUpperCase() === 'ADMIN';

    return (
      <div className="app-authenticated-layout" style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
        {/* Render the unified global Navbar right at the top */}
        <Navbar user={user} setUser={setUser} />
        
        {/* Render the matching layout container beneath the Navbar */}
        {isAdmin ? (
          <Dashboard user={user} setUser={setUser} />
        ) : (
          <StudentDashboard user={user} setUser={setUser} />
        )}
      </div>
    );
  }

  // 🌟 إذا لم يكن مسجلاً، نعرض له الواجهة المبهرة والاستمارات
  return (
    <div className="landing-layout" dir="rtl">
      <LandingPage onNavigateToAuth={scrollToAuth} />
      <AuthSection setUser={setUser} authView={authView} setAuthView={setAuthView} />
    </div>
  );
}

export default App;