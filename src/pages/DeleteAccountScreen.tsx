import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { MotiInput } from '@/components/ui/MotiInput';
import { OtpInput } from '@/components/ui/OtpInput';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Trash2, Mail, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'confirm' | 'credentials' | 'otp' | 'success';

export default function DeleteAccountScreen() {
  const navigate = useNavigate();
  const { user, deleteAccount, verifyDeleteOtp, isLoading } = useAuth();
  
  const [step, setStep] = useState<Step>('confirm');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProceed = () => {
    setStep('credentials');
  };

  const handleVerifyCredentials = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await deleteAccount(email, password);
    
    if (result.success && result.requiresOtp) {
      toast.success('OTP sent to your email!');
      setStep('otp');
    } else {
      toast.error(result.error || 'Verification failed');
      setErrors({ email: result.error || 'Invalid credentials' });
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const success = await verifyDeleteOtp(otp);
    
    if (success) {
      setStep('success');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  // Success screen
  if (step === 'success') {
    return (
      <div className="mobile-container min-h-screen flex flex-col items-center justify-center px-6">
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
          <h1 className="text-2xl font-bold mb-2">Account Deleted</h1>
          <p className="text-muted-foreground">
            Your account has been successfully deleted. We're sorry to see you go.
          </p>
        </motion.div>

        <MotiButton onClick={() => navigate('/home', { replace: true })} size="full">
          Back to Home
        </MotiButton>
      </div>
    );
  }

  // OTP verification screen
  if (step === 'otp') {
    return (
      <div className="mobile-container min-h-screen flex flex-col">
        <motion.button
          onClick={() => setStep('credentials')}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-muted/50 z-10"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={24} />
        </motion.button>

        <div className="flex-1 flex flex-col items-center px-6 pt-24">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6"
          >
            <Mail size={36} className="text-destructive" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold mb-2">Enter Verification Code</h1>
            <p className="text-muted-foreground">
              We sent a 6-digit code to<br />
              <span className="text-foreground font-medium">{email}</span>
            </p>
          </motion.div>

          <div className="w-full mb-8">
            <OtpInput length={6} onComplete={handleVerifyOtp} />
          </div>

          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
            Demo: Use OTP <span className="font-mono font-bold text-primary">123456</span>
          </p>
        </div>

        <div className="px-6 pb-8">
          <MotiButton 
            onClick={() => handleVerifyOtp('123456')} 
            size="full" 
            loading={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete My Account
          </MotiButton>
        </div>
      </div>
    );
  }

  // Credentials verification screen
  if (step === 'credentials') {
    return (
      <div className="mobile-container min-h-screen flex flex-col">
        <motion.button
          onClick={() => setStep('confirm')}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-muted/50 z-10"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={24} />
        </motion.button>

        <div className="flex-1 flex flex-col px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Lock size={32} className="text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verify Your Identity</h1>
            <p className="text-muted-foreground">
              Please enter your email and password to continue
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <MotiInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail size={20} />}
            />
            
            <MotiInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock size={20} />}
            />
          </motion.div>
        </div>

        <div className="px-6 pb-8">
          <MotiButton 
            onClick={handleVerifyCredentials} 
            size="full" 
            loading={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            Continue
          </MotiButton>
        </div>
      </div>
    );
  }

  // Confirmation screen
  return (
    <div className="mobile-container min-h-screen flex flex-col">
      <motion.button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-muted/50 z-10"
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={24} />
      </motion.button>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6"
        >
          <Trash2 size={48} className="text-destructive" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">Delete Account</h1>
          <p className="text-muted-foreground">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-destructive/10 rounded-xl p-4 mb-8"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive mb-1">Warning</p>
              <p className="text-muted-foreground">
                Deleting your account will permanently remove:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>All your test history and scores</li>
                <li>Your notes and study materials</li>
                <li>Your subscription (if any)</li>
                <li>All personal data</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 pb-8 space-y-3">
        <MotiButton 
          onClick={handleProceed} 
          size="full"
          className="bg-destructive hover:bg-destructive/90"
        >
          Continue with Deletion
        </MotiButton>
        <MotiButton 
          onClick={() => navigate(-1)} 
          variant="outline" 
          size="full"
        >
          Cancel
        </MotiButton>
      </div>
    </div>
  );
}
