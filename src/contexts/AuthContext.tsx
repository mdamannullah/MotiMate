import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User type with education data
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

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  subscription: 'free' | 'pro_monthly' | 'pro_yearly';
  education?: EducationData;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string | null;
  pendingName: string | null;
  pendingPassword: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresOtp?: boolean }>;
  verifyDeleteOtp: (otp: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [pendingDeleteEmail, setPendingDeleteEmail] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('motimate_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Load education data if exists
      const educationData = localStorage.getItem('motimate_education');
      if (educationData) {
        parsedUser.education = JSON.parse(educationData);
      }
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const savedUsers = JSON.parse(localStorage.getItem('motimate_users') || '{}');
    const existingUser = savedUsers[email];
    
    if (existingUser) {
      if (existingUser.password !== password) {
        setIsLoading(false);
        return { success: false, error: 'Incorrect password' };
      }
      
      // Load education data
      const educationData = localStorage.getItem('motimate_education');
      if (educationData) {
        existingUser.education = JSON.parse(educationData);
      }
      
      setUser(existingUser);
      localStorage.setItem('motimate_user', JSON.stringify(existingUser));
    } else {
      setIsLoading(false);
      return { success: false, error: 'Account not found. Please sign up first.' };
    }
    
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const savedUsers = JSON.parse(localStorage.getItem('motimate_users') || '{}');
    if (savedUsers[email]) {
      setIsLoading(false);
      return false;
    }
    
    setPendingEmail(email);
    setPendingName(name);
    setPendingPassword(password);
    setIsLoading(false);
    return true;
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo: accept 123456 or any 6-digit OTP
    if (otp.length === 6) {
      // Load education data
      const educationData = localStorage.getItem('motimate_education');
      const education = educationData ? JSON.parse(educationData) : undefined;
      
      const newUser: User = {
        id: Date.now().toString(),
        name: pendingName || 'Student',
        email: pendingEmail || 'user@example.com',
        password: pendingPassword || '',
        subscription: 'free',
        education,
      };
      
      const savedUsers = JSON.parse(localStorage.getItem('motimate_users') || '{}');
      savedUsers[newUser.email] = newUser;
      localStorage.setItem('motimate_users', JSON.stringify(savedUsers));
      
      setUser(newUser);
      localStorage.setItem('motimate_user', JSON.stringify(newUser));
      setPendingEmail(null);
      setPendingName(null);
      setPendingPassword(null);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('motimate_user');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPendingEmail(email);
    return true;
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const savedUsers = JSON.parse(localStorage.getItem('motimate_users') || '{}');
    const existingUser = savedUsers[user.email];
    
    if (existingUser && existingUser.password !== oldPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }
    
    const updatedUser = { ...user, password: newPassword };
    savedUsers[user.email] = updatedUser;
    localStorage.setItem('motimate_users', JSON.stringify(savedUsers));
    setUser(updatedUser);
    localStorage.setItem('motimate_user', JSON.stringify(updatedUser));
    
    return { success: true };
  };

  const deleteAccount = async (email: string, password: string): Promise<{ success: boolean; error?: string; requiresOtp?: boolean }> => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email !== user.email) {
      return { success: false, error: 'Email does not match your account' };
    }
    
    const savedUsers = JSON.parse(localStorage.getItem('motimate_users') || '{}');
    const existingUser = savedUsers[user.email];
    
    if (existingUser && existingUser.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }
    
    setPendingDeleteEmail(email);
    return { success: true, requiresOtp: true };
  };

  const verifyDeleteOtp = async (otp: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp.length === 6 && pendingDeleteEmail && user) {
      const savedUsers = JSON.parse(localStorage.getItem('motimate_users') || '{}');
      delete savedUsers[user.email];
      localStorage.setItem('motimate_users', JSON.stringify(savedUsers));
      
      localStorage.removeItem('motimate_user');
      localStorage.removeItem('motimate_stats');
      localStorage.removeItem('motimate_test_history');
      localStorage.removeItem('motimate_notifications');
      localStorage.removeItem('motimate_subject_scores');
      localStorage.removeItem('motimate_education');
      localStorage.removeItem('motimate_notes');
      
      setUser(null);
      setPendingDeleteEmail(null);
      return true;
    }
    return false;
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    const savedUsers = JSON.parse(localStorage.getItem('motimate_users') || '{}');
    savedUsers[user.email] = updatedUser;
    localStorage.setItem('motimate_users', JSON.stringify(savedUsers));
    setUser(updatedUser);
    localStorage.setItem('motimate_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        pendingEmail,
        pendingName,
        pendingPassword,
        login,
        signup,
        verifyOtp,
        logout,
        resetPassword,
        changePassword,
        deleteAccount,
        verifyDeleteOtp,
        updateUser,
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
