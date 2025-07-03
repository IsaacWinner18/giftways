"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, logout as apiLogout, register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPasswordWithToken } from './auth';

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified?: boolean;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  phoneNumber?: string;
  isAdmin?: boolean;
  participatedCampaigns?: string[];
  socialLinks?: Record<string, string>;
  totalCampaigns?: number;
  totalDistributed?: number;
  totalParticipants?: number;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  socialLinks?: Record<string, string>;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  phoneNumber?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  resetToken?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<AuthResponse>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPasswordWithToken: (token: string, newPassword: string) => Promise<AuthResponse>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-fetch profile if token exists
  useEffect(() => {
    async function fetchProfile() {
      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await getProfile();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
        apiLogout();
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const loginFn = async (email: string, password: string) => {
    const res = await login(email, password);
    if (res.success && res.token) {
      setToken(res.token);
      await refreshProfile();
    }
    return res;
  };

  const registerFn = async (data: RegisterData) => {
    const res = await register(data);
    return res;
  };

  const logoutFn = () => {
    apiLogout();
    setUser(null);
  };

  const updateProfileFn = async (data: UpdateProfileData) => {
    const res = await updateProfile(data);
    if (res.success && res.user) setUser(res.user);
    return res;
  };

  const changePasswordFn = async (oldPassword: string, newPassword: string) => {
    return changePassword(oldPassword, newPassword);
  };

  const forgotPasswordFn = async (email: string) => {
    return forgotPassword(email);
  };

  const resetPasswordWithTokenFn = async (token: string, newPassword: string) => {
    return resetPasswordWithToken(token, newPassword);
  };

  const refreshProfile = async () => {
    const res = await getProfile();
    if (res.success && res.user) setUser(res.user);
    else setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginFn,
        register: registerFn,
        logout: logoutFn,
        updateProfile: updateProfileFn,
        changePassword: changePasswordFn,
        forgotPassword: forgotPasswordFn,
        resetPasswordWithToken: resetPasswordWithTokenFn,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 