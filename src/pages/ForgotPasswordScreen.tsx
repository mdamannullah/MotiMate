import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { MotiInput } from '@/components/ui/MotiInput';
import { OtpInput } from '@/components/ui/OtpInput';
import { ArrowLeft, Mail, CheckCircle, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { generateOTP, storeOTP, verifyOTP } from '@/services/otpService';
import { showOtpNotification } from '@/components/ui/OtpNotification';
import { Footer } from '@/components/layout/Footer';

// Validation schemas - Email aur password ke liye validation rules
const emailSchema = z.string().email("Enter a valid email");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Send OTP - Email par OTP bhejta hai (local simulation)
  const handleSendOTP = async () => {
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
        return;
      }
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: { email: string }) => u.email === email);
    
    if (!userExists) {
      setError('No account found with this email');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate and store OTP using service
    const newOTP = generateOTP();
    storeOTP(email, newOTP, 'password_reset');

    // Show prominent OTP notification
    showOtpNotification(newOTP, email);
    
    setStep('otp');
    setIsLoading(false);
  };

  // Step 2: Verify OTP - User ne jo OTP daala usse verify karta hai
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify OTP using service
    const result = verifyOTP(email, otp, 'password_reset');

    if (!result.success) {
      setError(result.error || 'Invalid OTP');
      setIsLoading(false);
      return;
    }

    toast.success('OTP verified! ✅');
    setStep('password');
    setIsLoading(false);
  };

  // Step 3: Reset Password - Naya password set karta hai
  const handleResetPassword = async () => {
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
        return;
      }
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update password in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: { email: string; password: string }) => {
      if (u.email === email) {
        return { ...u, password };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast.success('Password reset successfully! 🎉');
    setStep('success');
    setIsLoading(false);
  };

  // Resend OTP - Naya OTP bhejta hai
  const handleResendOTP = async () => {
    setIsLoading(true);
    
    // Generate new OTP using service
    const newOTP = generateOTP();
    storeOTP(email, newOTP, 'password_reset');

    // Show prominent notification
    showOtpNotification(newOTP, email);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setOtp('');
    setError('');
    setIsLoading(false);
    toast.success('New OTP sent!');
  };

  // Success state
  if (step === 'success') {
    return (
      <div className="mobile-container min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-6"
          >
            <CheckCircle size={48} className="text-success" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold mb-2">Password Reset Successful!</h1>
            <p className="text-muted-foreground">
              Your password has been updated. You can now login with your new password.
            </p>
          </motion.div>

          <MotiButton onClick={() => navigate('/login')} size="full">
            Back to Login
          </MotiButton>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen flex flex-col">
      {/* Back button */}
      <motion.button
        onClick={() => {
          if (step === 'email') navigate(-1);
          else if (step === 'otp') setStep('email');
          else if (step === 'password') setStep('otp');
        }}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-muted/50"
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={24} />
      </motion.button>

      <div className="flex-1 flex flex-col px-6 pt-24">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {['email', 'otp', 'password'].map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${
                ['email', 'otp', 'password'].indexOf(step) >= i
                  ? 'bg-primary w-6'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Email */}
        {step === 'email' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6"
            >
              <Mail size={36} className="text-primary" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground">
                Enter your email and we'll send you an OTP to reset your password
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MotiInput
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                error={error}
                icon={<Mail size={20} />}
              />
            </motion.div>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6"
            >
              <KeyRound size={36} className="text-primary" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl font-bold mb-2">Enter OTP</h1>
              <p className="text-muted-foreground">
                We sent a 6-digit code to<br />
                <span className="text-foreground font-medium">{email}</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <OtpInput
                length={6}
                onComplete={(value) => {
                  setOtp(value);
                  setError('');
                }}
                error={error}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <button
                onClick={handleResendOTP}
                className="text-primary font-medium"
                disabled={isLoading}
              >
                Resend OTP
              </button>
            </motion.div>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 'password' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6"
            >
              <Lock size={36} className="text-primary" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
              <p className="text-muted-foreground">
                Enter a strong password for your account
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="relative">
                <MotiInput
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  icon={<Lock size={20} />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <MotiInput
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                error={error}
                icon={<Lock size={20} />}
              />
            </motion.div>
          </>
        )}
      </div>

      {/* Action button */}
      <div className="px-6 pb-4">
        <MotiButton
          onClick={
            step === 'email' ? handleSendOTP :
            step === 'otp' ? handleVerifyOTP :
            handleResetPassword
          }
          size="full"
          loading={isLoading}
        >
          {step === 'email' ? 'Send OTP' :
           step === 'otp' ? 'Verify OTP' :
           'Reset Password'}
        </MotiButton>
      </div>

      <Footer />
    </div>
  );
}