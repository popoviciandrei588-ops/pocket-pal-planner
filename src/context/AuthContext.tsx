import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const signingOutRef = useRef(false);

  useEffect(() => {
    // Listener first (prevents missed auth events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // During sign-out, some environments can briefly re-emit the old session.
      if (signingOutRef.current && session) return;

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Once we've observed a null session, we can resume normal listening.
      if (!session) signingOutRef.current = false;
    });

    // Then check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    // Best-effort sign out:
    // - some setups return session_not_found (403) even though local cleanup should still happen
    signingOutRef.current = true;

    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      // ignore
    }

    // Force-clear stored token in localStorage (supabase-js storage key)
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const ref = url ? new URL(url).hostname.split('.')[0] : null;
      if (ref) {
        const prefix = `sb-${ref}-auth-token`;
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) keysToRemove.push(k);
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      }
    } catch {
      // ignore
    }

    // Immediately reflect signed-out state in UI
    setSession(null);
    setUser(null);

    // allow listener to process future events
    setTimeout(() => {
      signingOutRef.current = false;
    }, 0);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
