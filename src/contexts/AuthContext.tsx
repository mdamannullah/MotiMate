import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface UserProfile {
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
  user: User | null;
  profile: UserProfile | null;
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

// Local storage keys
const USERS_KEY = 'motimate_users';
const CURRENT_USER_KEY = 'motimate_current_user';
const PROFILES_KEY = 'motimate_profiles';

// Helper functions for local storage
const getUsers = (): Record<string, { password: string; user: User }> => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
};

const getProfiles = (): Record<string, UserProfile> => {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveUsers = (users: Record<string, { password: string; user: User }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const saveProfiles = (profiles: Record<string, UserProfile>) => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Load current user on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Load profile
          const profiles = getProfiles();
          const userProfile = profiles[parsedUser.id];
          if (userProfile) {
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const profiles = getProfiles();
      const userProfile = profiles[user.id];
      if (userProfile) {
        setProfile(userProfile);
      }
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getUsers();
      const userEntry = users[email.toLowerCase()];
      
      if (!userEntry) {
        setIsLoading(false);
        return { success: false, error: 'No account found with this email' };
      }
      
      if (userEntry.password !== password) {
        setIsLoading(false);
        return { success: false, error: 'Invalid password' };
      }
      
      // Set current user
      setUser(userEntry.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userEntry.user));
      
      // Load profile
      const profiles = getProfiles();
      const userProfile = profiles[userEntry.user.id];
      if (userProfile) {
        setProfile(userProfile);
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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getUsers();
      const normalizedEmail = email.toLowerCase();
      
      // Check if user already exists
      if (users[normalizedEmail]) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email already exists' };
      }
      
      // Create new user
      const userId = crypto.randomUUID();
      const newUser: User = {
        id: userId,
        email: normalizedEmail,
        full_name: name,
        created_at: new Date().toISOString()
      };
      
      // Save user
      users[normalizedEmail] = { password, user: newUser };
      saveUsers(users);
      
      // Create profile
      const profiles = getProfiles();
      const newProfile: UserProfile = {
        id: crypto.randomUUID(),
        user_id: userId,
        full_name: name,
        email: normalizedEmail,
        country: educationData?.country,
        state: educationData?.state,
        district: educationData?.district,
        education_level: educationData?.level,
        board: educationData?.board,
        course: educationData?.course,
        university: educationData?.university,
        college: educationData?.college,
        is_autonomous: educationData?.isAutonomous,
        department: educationData?.department,
        stream: educationData?.stream,
        year: educationData?.year,
        semester: educationData?.semester,
        regulation: educationData?.regulation,
        subjects: educationData?.subjects || [],
      };
      profiles[userId] = newProfile;
      saveProfiles(profiles);
      
      // Set current user
      setUser(newUser);
      setProfile(newProfile);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      setPendingEmail(email);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const logout = async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setPendingEmail(email);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to send reset OTP.' };
    }
  };

  const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not logged in' };
      }
      
      const users = getUsers();
      const normalizedEmail = user.email.toLowerCase();
      
      if (users[normalizedEmail]) {
        users[normalizedEmail].password = newPassword;
        saveUsers(users);
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to change password.' };
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      const users = getUsers();
      const profiles = getProfiles();
      const normalizedEmail = user.email.toLowerCase();
      
      // Delete user data
      delete users[normalizedEmail];
      delete profiles[user.id];
      
      saveUsers(users);
      saveProfiles(profiles);
      
      // Clear local data for user
      localStorage.removeItem(`motimate_notes_${user.id}`);
      localStorage.removeItem(`motimate_test_results_${user.id}`);
      localStorage.removeItem(`motimate_notifications_${user.id}`);
      localStorage.removeItem(`motimate_chat_history_${user.id}`);
      
      await logout();
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete account.' };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };

    try {
      const profiles = getProfiles();
      const currentProfile = profiles[user.id];
      
      if (currentProfile) {
        profiles[user.id] = { ...currentProfile, ...updates };
        saveProfiles(profiles);
        setProfile(profiles[user.id]);
      }

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
