import { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, registerAPI, getProfileAPI } from '../api/auth.api.js';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. Check if user is already logged in when the app loads
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // If token exists, fetch their latest profile data
          const userData = await getProfileAPI();
          setUser(userData);
        } catch (error) {
          // If token is invalid/expired, the axios interceptor clears it
          setUser(null);
        }
      }
      setIsInitializing(false);
    };

    initAuth();
  }, []);

  // 2. The Login Function (Called by your AuthSection.jsx)
  const login = async (email, password) => {
    const data = await loginAPI({ email, password });
    
    // Save token to localStorage so Axios interceptor can use it
    localStorage.setItem('token', data.token);
    
    // Update the React state
    setUser(data.user);
    return data;
  };

  // 3. The Register Function (Called by your AuthSection.jsx)
  const register = async (email, password, name) => {
    const data = await registerAPI({ email, password, name });
    
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  // 4. The Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Optional: Redirect to home
    window.location.href = '/';
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };
  // Prevent flashing the login screen while checking local storage on refresh
  if (isInitializing) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);