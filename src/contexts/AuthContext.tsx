import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// User profile type with education data
interface EducationData {
  country: string;
  state: string;
  district?: string;
  level: string;
  board?: string;
  stream?: string;
  course?: string;
  university?: string;
  college?: string;
  isAutonomous?: boolean;
  department?: string;
  year?: string;
  semester?: string;
  regulation?: string;
  subjects: string[];
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  country?: string;
  country_code?: string;
  state?: string;
  district?: string;
  education_level?: string;
  board?: string;
  course?: string;
  university?: string;
  college?: string;
  is_autonomous?: boolean;
  department?: string;
  stream?: string;
  year?: string;
  semester?: string;
  regulation?: string;
  subjects?: string[];
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, educationData?: EducationData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id).then(setProfile);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Create login notification
      if (data.user) {
        await supabase.from('notifications').insert({
          user_id: data.user.id,
          title: 'Login Successful',
          message: 'Welcome back to MotiMate!',
          type: 'login'
        });
      }

      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    educationData?: EducationData
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Update profile with education data if user was created
      if (data.user && educationData) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: name,
            country: educationData.country,
            country_code: educationData.country,
            state: educationData.state,
            district: educationData.district,
            education_level: educationData.level,
            board: educationData.board,
            course: educationData.course,
            university: educationData.university,
            college: educationData.college,
            is_autonomous: educationData.isAutonomous,
            department: educationData.department,
            stream: educationData.stream,
            year: educationData.year,
            semester: educationData.semester,
            regulation: educationData.regulation,
            subjects: educationData.subjects,
          })
          .eq('user_id', data.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }
      }

      setPendingEmail(email);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Use OTP-based password reset flow
      const { data, error } = await supabase.functions.invoke('password-reset', {
        body: { action: 'send', email }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data?.success) {
        return { success: false, error: data?.error || 'Failed to send OTP' };
      }

      setPendingEmail(email);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to send reset OTP.' };
    }
  };

  const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Create notification
      if (user) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Password Changed',
          message: 'Your password has been updated successfully.',
          type: 'password_change'
        });
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to change password.' };
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      // Delete user data first (cascade should handle this, but being safe)
      await supabase.from('notes').delete().eq('user_id', user.id);
      await supabase.from('test_results').delete().eq('user_id', user.id);
      await supabase.from('notifications').delete().eq('user_id', user.id);
      await supabase.from('chat_history').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('user_id', user.id);
      
      // Note: Actual user deletion requires admin rights or a server function
      // For now, we'll just sign out
      await logout();
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete account.' };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      await refreshProfile();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to update profile.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAuthenticated: !!user,
        isLoading,
        pendingEmail,
        login,
        signup,
        logout,
        resetPassword,
        changePassword,
        deleteAccount,
        updateProfile,
        refreshProfile,
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
