import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Auth context ke types define karte hain
interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Stored for demo purposes only
  subscription: 'free' | 'pro_monthly' | 'pro_yearly';
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

// Context create karte hain
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component - ye saare children ko auth state dega
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [pendingDeleteEmail, setPendingDeleteEmail] = useState<string | null>(null);

  // Check karte hain agar user pehle se logged in hai (localStorage se)
  useEffect(() => {
    const savedUser = localStorage.getItem('motimate_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function - email aur password se login
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in storage
    const savedUsers = JSON.parse(localStorage.getItem('motimate_users') || '{}');
    const existingUser = savedUsers[email];
    
    if (existingUser) {
      if (existingUser.password !== password) {
        setIsLoading(false);
        return { success: false, error: 'Incorrect password' };
      }
      setUser(existingUser);
      localStorage.setItem('motimate_user', JSON.stringify(existingUser));
    } else {
      // Create new user for demo
      const demoUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        password: password,
        subscription: 'free',
      };
      
      savedUsers[email] = demoUser;
      localStorage.setItem('motimate_users', JSON.stringify(savedUsers));
      setUser(demoUser);
      localStorage.setItem('motimate_user', JSON.stringify(demoUser));
    }
    
    setIsLoading(false);
    return { success: true };
  };

  // Signup function - naya account banane ke liye
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
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

  // OTP verify karne ka function
  const verifyOtp = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo: 123456 valid OTP maanenge
    if (otp === '123456') {
      const newUser: User = {
        id: Date.now().toString(),
        name: pendingName || 'Student',
        email: pendingEmail || 'user@example.com',
        password: pendingPassword || '',
        subscription: 'free',
      };
      
      // Save user to users list
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

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('motimate_user');
  };

  // Password reset function
  const resetPassword = async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPendingEmail(email);
    return true;
  };

  // Change password function
  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check old password
    const savedUsers = JSON.parse(localStorage.getItem('motimate_users') || '{}');
    const existingUser = savedUsers[user.email];
    
    if (existingUser && existingUser.password !== oldPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }
    
    // Update password
    const updatedUser = { ...user, password: newPassword };
    savedUsers[user.email] = updatedUser;
    localStorage.setItem('motimate_users', JSON.stringify(savedUsers));
    setUser(updatedUser);
    localStorage.setItem('motimate_user', JSON.stringify(updatedUser));
    
    return { success: true };
  };

  // Delete account - step 1: verify email and password
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

  // Delete account - step 2: verify OTP
  const verifyDeleteOtp = async (otp: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp === '123456' && pendingDeleteEmail && user) {
      // Delete user from storage
      const savedUsers = JSON.parse(localStorage.getItem('motimate_users') || '{}');
      delete savedUsers[user.email];
      localStorage.setItem('motimate_users', JSON.stringify(savedUsers));
      
      // Clear all user data
      localStorage.removeItem('motimate_user');
      localStorage.removeItem('motimate_stats');
      localStorage.removeItem('motimate_test_history');
      localStorage.removeItem('motimate_notifications');
      localStorage.removeItem('motimate_subject_scores');
      
      setUser(null);
      setPendingDeleteEmail(null);
      return true;
    }
    return false;
  };

  // Update user
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

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
