import { createContext, useContext, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Lazily initialize user state directly from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('taskUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error('Failed to parse user session:', err);
      localStorage.removeItem('taskUser');
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('taskUser', JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('taskUser', JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};