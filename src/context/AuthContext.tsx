import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Address } from '../types';
import { authService } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateUser: (updates: Partial<User>) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  updateAddress: (address: Address) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.register(name, email, phone, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      return await authService.forgotPassword(email);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('someshwar_current_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addAddress = useCallback((address: Address) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, addresses: [...prev.addresses, address] };
      localStorage.setItem('someshwar_current_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeAddress = useCallback((addressId: string) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, addresses: prev.addresses.filter(a => a.id !== addressId) };
      localStorage.setItem('someshwar_current_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateAddress = useCallback((address: Address) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, addresses: prev.addresses.map(a => a.id === address.id ? address : a) };
      localStorage.setItem('someshwar_current_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user, isAuthenticated: !!user, isLoading,
        login, register, logout, forgotPassword,
        updateUser, addAddress, removeAddress, updateAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
