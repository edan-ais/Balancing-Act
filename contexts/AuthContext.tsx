import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMountedRef.current) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMountedRef.current) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // If this is a new sign up, create the user profile
          if (event === 'SIGNED_IN' && session?.user?.app_metadata?.provider === 'email') {
            const createdAt = new Date(session.user.created_at);
            const now = new Date();
            // If account was created in the last minute, assume it's a new signup
            if (now.getTime() - createdAt.getTime() < 60000) {
              await createUserProfile(session.user.id);
            }
          }
        }
      }
    );

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  // Create user profile after successful signup
  const createUserProfile = useCallback(async (userId: string) => {
    if (!isMountedRef.current) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          current_theme: 'balance',
          selected_tabs: ['index', 'goals', 'weekly', 'meal-prep', 'cleaning', 'self-care', 'delegation']
        });

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        console.error('Error creating user profile:', error);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }, []);

  // Memoize auth functions to prevent unnecessary re-renders
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      // If signup was successful and the component is still mounted
      if (!error && data.user && isMountedRef.current) {
        // Create user profile
        await createUserProfile(data.user.id);
      }
      
      return { error };
    } catch (err) {
      console.error('Error during sign up:', err);
      return { error: err };
    }
  }, [createUserProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err) {
      console.error('Error during sign in:', err);
      return { error: err };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (isMountedRef.current) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, signUp, signIn, signOut]);

  return (
    <AuthContext.Provider value={contextValue}>
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