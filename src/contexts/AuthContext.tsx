import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Auth context ke types define karte hain
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  subscription: 'free' | 'pro_monthly' | 'pro_yearly';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}

// Context create karte hain
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component - ye saare children ko auth state dega
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Check karte hain agar user pehle se logged in hai (localStorage se)
  useEffect(() => {
    const savedUser = localStorage.getItem('motimate_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function - email aur password se login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call - production mein backend se connect karenge
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo user create karte hain
    const demoUser: User = {
      id: '1',
      name: 'Rahul Kumar',
      email: email,
      phone: '+91 98765 43210',
      subscription: 'free',
    };
    
    setUser(demoUser);
    localStorage.setItem('motimate_user', JSON.stringify(demoUser));
    setIsLoading(false);
    return true;
  };

  // Signup function - naya account banane ke liye
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPendingEmail(email);
    setIsLoading(false);
    return true; // OTP verification ke liye redirect karenge
  };

  // OTP verify karne ka function
  const verifyOtp = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo: 123456 valid OTP maanenge
    if (otp === '123456') {
      const newUser: User = {
        id: Date.now().toString(),
        name: 'New User',
        email: pendingEmail || 'user@example.com',
        subscription: 'free',
      };
      setUser(newUser);
      localStorage.setItem('motimate_user', JSON.stringify(newUser));
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        verifyOtp,
        logout,
        resetPassword,
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
