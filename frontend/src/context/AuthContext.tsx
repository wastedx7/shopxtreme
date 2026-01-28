import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api/auth';
import type { User, UserRole, LoginRequest, CustomerRegisterRequest, SellerRegisterRequest } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  registerCustomer: (data: CustomerRegisterRequest) => Promise<void>;
  registerSeller: (data: SellerRegisterRequest) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isCustomer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch {
      setUser(null);
    }
  }, []);

  // On mount, try to fetch the user profile (for existing session)
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await fetchProfile();
      setIsLoading(false);
    };
    initAuth();
  }, [fetchProfile]);

  const login = async (data: LoginRequest) => {
    const loggedInUser = await authApi.login(data);
    setUser(loggedInUser);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const registerCustomer = async (data: CustomerRegisterRequest) => {
    await authApi.registerCustomer(data);
    // After registration, user needs to log in
  };

  const registerSeller = async (data: SellerRegisterRequest) => {
    await authApi.registerSeller(data);
    // After registration, user needs to log in
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    registerCustomer,
    registerSeller,
    hasRole,
    hasAnyRole,
    isCustomer: hasRole('ROLE_CUSTOMER'),
    isSeller: hasRole('ROLE_SELLER'),
    isAdmin: hasRole('ROLE_ADMIN'),
    refetchProfile: fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
