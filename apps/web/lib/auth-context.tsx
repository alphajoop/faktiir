'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import { auth, SESSION_EXPIRED_EVENT, type User } from '@/lib/api';

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
  const toastShownRef = useRef(false);

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

  // Listen for 401 events emitted by the API client
  useEffect(() => {
    const handle = () => {
      // Only show the toast once per "session expired" cycle
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast.error('Session expirée', {
          description: 'Veuillez vous reconnecter.',
          duration: 5000,
          onDismiss: () => {
            toastShownRef.current = false;
          },
        });
      }
      setUser(null);
      // Small delay so the toast is visible before redirect
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handle);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handle);
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
    toastShownRef.current = false;
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
