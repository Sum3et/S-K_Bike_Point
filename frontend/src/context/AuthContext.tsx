import React, { createContext, useState, useEffect, useCallback } from 'react';
import { AuthContextType, LoginCredentials, RegisterCredentials } from '../types/auth';
import { User } from '../types/user';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.getUser<User>());
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session and verify with /api/auth/me
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = storage.getToken();
      if (storedToken) {
        try {
          const currentUser = await authService.getMe();
          setUser(currentUser);
          storage.setUser(currentUser);
        } catch {
          // If token is expired or invalid on startup
          storage.clearAuth();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      storage.setToken(data.token);
      storage.setUser(data.user);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await authService.register(credentials);
      storage.setToken(data.token);
      storage.setUser(data.user);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback((): void => {
    storage.clearAuth();
    setUser(null);
    setToken(null);
  }, []);

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
      storage.setUser(currentUser);
    } catch (e) {
      console.error('Failed to refresh user profile:', e);
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isCustomer = user?.role === 'ROLE_CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        isCustomer,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
