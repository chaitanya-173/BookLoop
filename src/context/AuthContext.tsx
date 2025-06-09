import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { storageUtils } from '../utils/localStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = storageUtils.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = storageUtils.findUserByEmail(email);
    if (foundUser) {
      // In a real app, you'd verify the password hash
      setUser(foundUser);
      setIsAuthenticated(true);
      storageUtils.setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    const existingUser = storageUtils.findUserByEmail(userData.email);
    if (existingUser) {
      return false; // User already exists
    }

    const newUser: User = {
      id: storageUtils.generateId(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      createdAt: new Date().toISOString(),
    };

    storageUtils.saveUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    storageUtils.setCurrentUser(newUser);
    return true;
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    storageUtils.setCurrentUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};