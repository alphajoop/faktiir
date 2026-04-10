'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth, type User } from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user from backend - cookie is sent automatically
  const refresh = useCallback(async () => {
    try {
      const data = await auth.meWithCookie();
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
