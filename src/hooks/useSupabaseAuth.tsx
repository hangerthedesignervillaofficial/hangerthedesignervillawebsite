import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { profileService } from '@/services/profile/profileService'; // Import profileService
import { authService } from '@/services/auth/authService'; // Import authService

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a mocked session
    const cachedMock = typeof window !== 'undefined' ? localStorage.getItem('hanger_mock_session') : null;
    if (cachedMock) {
      try {
        const parsed = JSON.parse(cachedMock);
        if (typeof window !== 'undefined') {
          document.cookie = "hanger_mock_session_active=true; path=/; max-age=86400";
        }
        setSession(parsed);
        setUser(parsed.user);
        setLoading(false);
        return; // Skip normal supabase setup since we are in mock mode
      } catch (e) {
        console.error("Error parsing cached mock session", e);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (typeof window !== 'undefined' && localStorage.getItem('hanger_mock_session')) return;
      setSession(session);
      setUser(session?.user ?? null);
      // If user logs in, ensure they exist in our profiles table
      if (session?.user) {
        ensureUserProfile(session.user);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (typeof window !== 'undefined' && localStorage.getItem('hanger_mock_session')) return;
      setSession(session);
      setUser(session?.user ?? null);
      // If we have a user, ensure they exist in our profiles table
      if (session?.user) {
        ensureUserProfile(session.user);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Ensure user exists in the profiles table
  const ensureUserProfile = async (user: User) => {
    try {
      // Get user email from auth - use the User object's email first, then try to fetch if not available
      let userEmail = user.email || '';

      if (!userEmail) {
        console.log(
          'Email not available in user object, fetching from auth service...'
        );
        try {
          const authUserEmail = await authService.getCurrentUserEmail();
          if (authUserEmail) {
            userEmail = authUserEmail;
            console.log(
              'Successfully fetched email from auth service:',
              userEmail
            );
          }
        } catch (emailError) {
          console.error('Error fetching email from auth service:', emailError);
        }
      }

      // Check if user profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('profile_id, email')
        .eq('profile_id', user.id)
        .single();

      if (existingProfile) {
        // Profile already exists, update email if needed
        if (!existingProfile.email && userEmail) {
          console.log('Updating existing profile with email:', userEmail);
          await profileService.updateProfile(user.id, {
            email: userEmail,
          });
        }
        return;
      }

      // Create profile directly with Supabase
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          profile_id: user.id,
          username: '',
          avatar_url: '',
          email: userEmail,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        // Check if this is a duplicate key error (profile was created by another request)
        if (createError.code === '23505') {
          console.log('Profile already exists (created by another request)');
          return;
        }

        console.error('Error creating user profile:', createError);
        throw createError;
      }
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
      // Don't throw - we'll handle this on profile page visit
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const normalizedEmail = (email || '').trim().toLowerCase();
      const normalizedPassword = (password || '').trim();

      // Check for mock accounts
      if (
        (normalizedEmail === 'customer@gmail.com' && normalizedPassword === '12345678') ||
        (normalizedEmail === 'admin@gmail.com' && normalizedPassword === '12345678')
      ) {
        const isAdminUser = normalizedEmail === 'admin@gmail.com';
        const mockUser: User = {
          id: isAdminUser ? 'mock-admin-id-1111111111111111' : 'mock-customer-id-0000000000000000',
          email: normalizedEmail,
          role: 'authenticated',
          aud: 'authenticated',
          app_metadata: { provider: 'email' },
          user_metadata: {},
          created_at: new Date().toISOString(),
        };
        const mockSession: Session = {
          access_token: 'mock-token-' + (isAdminUser ? 'admin' : 'customer'),
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: mockUser,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('hanger_mock_session', JSON.stringify(mockSession));
          document.cookie = "hanger_mock_session_active=true; path=/; max-age=86400";
        }
        setSession(mockSession);
        setUser(mockUser);

        // Ensure user profile exists in database if Supabase is connected
        await ensureUserProfile(mockUser);

        toast.success('Signed in successfully (Demo Mode)');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Signed in successfully');
    } catch (error) {
      toast.error('Failed to sign in');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      // If signup is successfully and we have a user, ensure profile exists
      if (data?.user) {
        await ensureUserProfile(data.user);
      }

      toast.success('Signed up successfully');
    } catch (error) {
      toast.error('Failed to sign up');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out user:', user?.email);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hanger_mock_session');
        document.cookie = "hanger_mock_session_active=; path=/; max-age=-1";
      }

      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error("Supabase signOut error (expected if mock):", e);
      }

      // Explicitly clear user and session state
      setUser(null);
      setSession(null);

      console.log('Sign out complete, state cleared');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error('Failed to sign in with Google');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { user, session, loading, signIn, signUp, signOut, signInWithGoogle };
}
