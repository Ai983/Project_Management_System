// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Automatically checks login status using cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/auth/me');
        setIsLoggedIn(true);
      } catch (err) {
        // If /auth/me fails, try to refresh
        try {
          await api.post('/auth/refresh');
          // After refresh, try /auth/me again
          await api.get('/auth/me');
          setIsLoggedIn(true);
        } catch (refreshErr) {
          setIsLoggedIn(false);
        }
      }
    };
    checkAuth();
  }, []);

  // Function to manually set login state to true
  const login = () => {
    setIsLoggedIn(true);
  };

  // ✅ Logout function clears cookie and updates state
  const logout = () => {
    api.post('/auth/logout').finally(() => {
      setIsLoggedIn(false);
      window.location.href = '/';
    });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
