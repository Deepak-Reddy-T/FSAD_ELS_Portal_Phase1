import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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

  const SESSION_KEY = 'equip_portal_auth';
  const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }, [SESSION_KEY]);

  const loadSession = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data.token || !data.user || !data.expiresAt) return null;
      if (Date.now() >= data.expiresAt) {
        clearSession();
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }, [SESSION_KEY, clearSession]);

  const saveSession = (token, userObj) => {
    const expiresAt = Date.now() + EIGHT_HOURS_MS;
    const payload = { token, user: userObj, expiresAt };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  useEffect(() => {
    const session = loadSession();
    if (session) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
      setUser(session.user);
    }
    setLoading(false);
  }, [loadSession]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });
      
      const { token, id, username: userUsername, email, firstName, lastName, role } = response.data;

      const userObj = { id, username: userUsername, email, firstName, lastName, role };
      saveSession(token, userObj);
      setUser(userObj);
      
      return { success: true };
    } catch (error) {
      console.log('Login error:', error); // Debug log
      console.log('Error code:', error.code); // Debug log
      console.log('Error message:', error.message); // Debug log
      console.log('Error response:', error.response); // Debug log
      console.log('Error response data:', error.response?.data); // Debug log
      console.log('Error response status:', error.response?.status); // Debug log
      
      // Check if it's a network error (server is down)
      // This includes ECONNREFUSED, ERR_NETWORK, proxy errors, and cases where there's no response
      if (!error.response || 
          error.code === 'ERR_NETWORK' || 
          error.code === 'ECONNREFUSED' || 
          error.message?.toLowerCase().includes('econnrefused') ||
          error.message?.toLowerCase().includes('network error') ||
          error.message?.toLowerCase().includes('proxy')) {
        return { 
          success: false, 
          error: 'Server is down, please try again!' 
        };
      }
      
      // Check if it's an authentication error (wrong credentials)
      if (error.response?.status === 401) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Username or password is incorrect' 
        };
      }
      
      // Check if it's a 500 error that might be authentication related
      if (error.response?.status === 500) {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || '';
        // If the 500 error is related to authentication, show appropriate message
        if (errorMsg.toLowerCase().includes('credential') || 
            errorMsg.toLowerCase().includes('authentication') ||
            errorMsg.toLowerCase().includes('username') ||
            errorMsg.toLowerCase().includes('password')) {
          return { 
            success: false, 
            error: 'Username or password is incorrect' 
          };
        }
      }
      
      // For other errors, return the error message from the server or a generic message
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      await axios.post('/api/auth/signup', userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
