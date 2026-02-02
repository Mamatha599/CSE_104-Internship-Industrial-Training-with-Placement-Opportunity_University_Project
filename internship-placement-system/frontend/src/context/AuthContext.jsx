import React, { createContext, useContext, useState, useEffect } from 'react';
import { authUtils } from '../utils/auth.util';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = authUtils.getToken();
    if (token) {
      const userData = authUtils.getUserFromToken(token);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    authUtils.setToken(token);
    setUser(userData);
  };

  const logout = () => {
    authUtils.removeToken();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};