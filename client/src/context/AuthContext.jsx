import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('campusbite_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (e) {
        localStorage.removeItem('campusbite_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(
      'campusbite_user',
      JSON.stringify({ user: data.user, token: data.token })
    );
    return data;
  };

  const signup = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    const data = res.data;
    if (data.token) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(
        'campusbite_user',
        JSON.stringify({ user: data.user, token: data.token })
      );
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campusbite_user');
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    const stored = localStorage.getItem('campusbite_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.user = updatedUser;
      localStorage.setItem('campusbite_user', JSON.stringify(parsed));
    }
  };

  // 1-Click Demo Login Helper for Testing
  const demoLogin = async (role) => {
    const demoCredentials = {
      admin: { email: 'admin@iiti.ac.in', password: 'password123' },
      customer: { email: 'student@iiti.ac.in', password: 'password123' },
      shop_owner: { email: 'shop@iiti.ac.in', password: 'password123' },
      delivery_partner: { email: 'delivery@iiti.ac.in', password: 'password123' },
    };

    const creds = demoCredentials[role];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
        demoLogin,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'customer',
        isShopOwner: user?.role === 'shop_owner',
        isDeliveryPartner: user?.role === 'delivery_partner',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
