// OTP Service - Centralized OTP management for signup and password reset
// Ye service OTP generate, store, verify aur expire handle karta hai

interface StoredOTP {
  email: string;
  otp: string;
  expiresAt: number;
  type: 'signup' | 'password_reset';
  attempts: number;
}

// In-memory OTP storage (production mein database use karein)
const otpStore = new Map<string, StoredOTP>();

// Maximum attempts before OTP is invalidated
const MAX_ATTEMPTS = 3;

// OTP expiry time in milliseconds (5 minutes)
const OTP_EXPIRY = 5 * 60 * 1000;

// Generate random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP for email
export const storeOTP = (
  email: string, 
  otp: string, 
  type: 'signup' | 'password_reset'
): void => {
  const key = `${type}:${email.toLowerCase()}`;
  otpStore.set(key, {
    email: email.toLowerCase(),
    otp,
    expiresAt: Date.now() + OTP_EXPIRY,
    type,
    attempts: 0
  });
};

// Verify OTP for email
export const verifyOTP = (
  email: string, 
  otp: string, 
  type: 'signup' | 'password_reset'
): { success: boolean; error?: string } => {
  const key = `${type}:${email.toLowerCase()}`;
  const stored = otpStore.get(key);

  // Check if OTP exists
  if (!stored) {
    return { success: false, error: 'OTP expired or not found. Please request a new one.' };
  }

  // Check if OTP has expired
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(key);
    return { success: false, error: 'OTP has expired. Please request a new one.' };
  }

  // Check attempts
  if (stored.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(key);
    return { success: false, error: 'Too many failed attempts. Please request a new OTP.' };
  }

  // Verify OTP
  if (stored.otp !== otp) {
    stored.attempts++;
    otpStore.set(key, stored);
    const remaining = MAX_ATTEMPTS - stored.attempts;
    return { 
      success: false, 
      error: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` 
    };
  }

  // OTP is valid - remove it (one-time use)
  otpStore.delete(key);
  return { success: true };
};

// Check if OTP exists and is valid (without verifying)
export const hasValidOTP = (
  email: string, 
  type: 'signup' | 'password_reset'
): boolean => {
  const key = `${type}:${email.toLowerCase()}`;
  const stored = otpStore.get(key);
  
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(key);
    return false;
  }
  
  return true;
};

// Invalidate OTP for email
export const invalidateOTP = (
  email: string, 
  type: 'signup' | 'password_reset'
): void => {
  const key = `${type}:${email.toLowerCase()}`;
  otpStore.delete(key);
};

// Get remaining time for OTP in seconds
export const getOTPRemainingTime = (
  email: string, 
  type: 'signup' | 'password_reset'
): number => {
  const key = `${type}:${email.toLowerCase()}`;
  const stored = otpStore.get(key);
  
  if (!stored) return 0;
  
  const remaining = Math.max(0, stored.expiresAt - Date.now());
  return Math.ceil(remaining / 1000);
};
