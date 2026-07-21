import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAPI, registerAPI, getProfileAPI, refreshAPI, logoutAPI, logoutAllAPI } from '../api/auth.api.js';
import { setAccessToken } from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  // On app load: no token exists in memory yet (page was just reloaded).
  // Try silent refresh using the httpOnly cookie — if it succeeds, we're still logged in.
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await refreshAPI();
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  // Listen for the axios interceptor's "session truly expired" signal
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setAccessToken(null);
      if (!window.location.pathname.startsWith('/login')) {
        navigate('/login');
      }
    };
    window.addEventListener('auth:session-expired', handleExpired);
    return () => window.removeEventListener('auth:session-expired', handleExpired);
  }, [navigate]);

  const login = async (email, password) => {
    const data = await loginAPI({ email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const register = async (email, password, name) => {
    const data = await registerAPI({ email, password, name });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } finally {
      setAccessToken(null);
      setUser(null);
      navigate('/');
    }
  };

  const logoutAllDevices = async () => {
    try {
      await logoutAllAPI();
    } finally {
      setAccessToken(null);
      setUser(null);
      navigate('/');
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  if (isInitializing) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, logoutAllDevices, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);