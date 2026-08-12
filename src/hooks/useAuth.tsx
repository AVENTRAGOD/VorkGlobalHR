import React, { useState, useEffect, createContext, useContext } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  uid: string | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY  = 'hr_pulse_v8_session';
const TOKEN_KEY    = 'hr_pulse_v8_token';

/** Returns the stored JWT token (used by API service layer) */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<UserProfile | null>(null);
  const [uid, setUid]         = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    const savedToken   = localStorage.getItem(TOKEN_KEY);

    if (savedSession && savedToken) {
      try {
        const parsed = JSON.parse(savedSession) as UserProfile;
        setUser(parsed);
        setUid(parsed.uid);
      } catch {
        // Corrupt session — clear it
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<void> => {
    const res = await fetch('/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ emailOrUsername, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login failed');
    }

    const { token, user: profile } = await res.json();

    // Persist JWT + profile
    localStorage.setItem(TOKEN_KEY,    token);
    localStorage.setItem(SESSION_KEY,  JSON.stringify(profile));

    setUser(profile);
    setUid(profile.uid);
  };

  const logout = () => {
    setUser(null);
    setUid(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateUser = (userData: UserProfile) => {
    setUser(userData);
    setUid(userData.uid);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, uid, loading, login, logout, updateUser }}>
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
