'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import { User } from '@/types';
import Cookies from 'js-cookie';
import { useAppDispatch } from '@/store';
import { clearHistory } from '@/store/historySlice';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getProfile();
        setUser(userData);
      } catch (err) {
        // If token is invalid, clear cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(email, password);
      const { access_token, refresh_token, user } = response;
      
      // Set cookies with appropriate options
      Cookies.set('accessToken', access_token, { 
        secure: true, 
        sameSite: 'strict',
        path: '/'
      });
      Cookies.set('refreshToken', refresh_token, { 
        secure: true, 
        sameSite: 'strict',
        path: '/'
      });
      
      setUser(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(name, email, password);
      const { access_token, refresh_token, user } = response;
      
      Cookies.set('accessToken', access_token, { secure: true, sameSite: 'strict' });
      Cookies.set('refreshToken', refresh_token, { secure: true, sameSite: 'strict' });
      setUser(user);
      
      router.push('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear auth data
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setUser(null);
      
      // Clear history data
      dispatch(clearHistory());
      
      setIsLoading(false);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}