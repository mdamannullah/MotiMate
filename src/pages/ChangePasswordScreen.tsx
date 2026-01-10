import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { MotiInput } from '@/components/ui/MotiInput';
import { OtpInput } from '@/components/ui/OtpInput';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { generateOTP, storeOTP, verifyOTP } from '@/services/otpService';
import { showOtpNotification } from '@/components/ui/OtpNotification';
import { Footer } from '@/components/layout/Footer';

// Step flow: password -> otp -> success
type Step = 'password' | 'otp' | 'success';

export default function ChangePasswordScreen() {
  const navigate = useNavigate();
  const { user, changePassword, isLoading } = useAuth();
  const { addNotification } = useData();
  
  const [step, setStep] = useState<Step>('password');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState(false);

  // Get user email
  const userEmail = user?.email || '';

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Validate password and send OTP
  const handleSendOTP = async () => {
    if (!validatePassword()) return;

    if (!userEmail) {
      toast.error('User email not found. Please login again.');
      return;
    }

    // Generate and store OTP
    const newOTP = generateOTP();
    storeOTP(userEmail, newOTP, 'password_reset');

    // Show OTP notification
    showOtpNotification(newOTP, userEmail);

    // Move to OTP step
    setStep('otp');
    toast.success('OTP sent to your email!');
  };

  // Step 2: Verify OTP and change password
  const handleVerifyAndChange = async () => {
    if (otp.length !== 6) {
      setErrors({ otp: 'Please enter complete 6-digit OTP' });
      return;
    }

    setVerifying(true);
    setErrors({});

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify OTP
    const result = verifyOTP(userEmail, otp, 'password_reset');

    if (!result.success) {
      setErrors({ otp: result.error || 'Invalid OTP' });
      setVerifying(false);
      return;
    }

    // OTP verified - change password
    const changeResult = await changePassword(newPassword);
    
    if (changeResult.success) {
      await addNotification({
        type: 'password_change',
        title: 'Password Changed',
        message: 'Your password has been successfully updated',
      });
      toast.success('Password changed successfully!');
      setStep('success');
    } else {
      toast.error(changeResult.error || 'Failed to change password');
      setErrors({ otp: changeResult.error || 'Failed to change password' });
    }

    setVerifying(false);
  };

  // Resend OTP
  const handleResendOTP = () => {
    const newOTP = generateOTP();
    storeOTP(userEmail, newOTP, 'password_reset');
    showOtpNotification(newOTP, userEmail);
    setOtp('');
    setErrors({});
    toast.success('New OTP sent!');
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'otp') {
      setStep('password');
      setOtp('');
      setErrors({});
    } else {
      navigate(-1);
    }
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
            <h1 className="text-2xl font-bold mb-2">Password Changed!</h1>
            <p className="text-muted-foreground">
              Your password has been successfully updated
            </p>
          </motion.div>

          <MotiButton onClick={() => navigate('/settings')} size="full">
            Back to Settings
          </MotiButton>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen flex flex-col">
      <motion.button
        onClick={handleBack}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-muted/50 z-10"
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={24} />
      </motion.button>

      <div className="flex-1 flex flex-col px-6 pt-20">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {['password', 'otp'].map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${
                ['password', 'otp'].indexOf(step) >= i
                  ? 'bg-primary w-6'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Password */}
        {step === 'password' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock size={32} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Change Password</h1>
              <p className="text-muted-foreground">Create a new password for your account</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <MotiInput
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={errors.newPassword}
                icon={<Lock size={20} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
              
              <MotiInput
                label="Confirm New Password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                icon={<Lock size={20} />}
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
              <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>
              <p className="text-muted-foreground">
                We sent a 6-digit code to<br />
                <span className="text-foreground font-medium">{userEmail}</span>
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
                  setErrors({});
                }}
                error={errors.otp}
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
                disabled={verifying}
              >
                Resend OTP
              </button>
            </motion.div>
          </>
        )}
      </div>

      {/* Action button */}
      <div className="px-6 pb-4">
        <MotiButton
          onClick={step === 'password' ? handleSendOTP : handleVerifyAndChange}
          size="full"
          loading={isLoading || verifying}
        >
          {step === 'password' ? 'Send OTP' : 'Verify & Change Password'}
        </MotiButton>
      </div>

      <Footer />
    </div>
  );
}