import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiService';

/**
 * Authentication Context
 * Manages user authentication state globally
 */

const AuthContext = createContext(null);

const getAuthErrorMessage = (err, fallback) => {
  const details = err.response?.data?.errors;
  if (Array.isArray(details) && details.length > 0) {
    return details.join(', ');
  }

  return err.response?.data?.message || err.message || fallback;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setError(null);
      return response.data;
    } catch (err) {
      const message = getAuthErrorMessage(err, 'Login failed');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password, age, gender) => {
    setLoading(true);
    try {
      const response = await authAPI.register({
        firstName,
        lastName,
        email,
        password,
        age,
        gender
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setError(null);
      return response.data;
    } catch (err) {
      const message = getAuthErrorMessage(err, 'Registration failed');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
