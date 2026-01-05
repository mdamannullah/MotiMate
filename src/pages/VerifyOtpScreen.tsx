import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { OtpInput } from '@/components/ui/OtpInput';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function VerifyOtpScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useAuth();
  
  const email = location.state?.email || 'user@example.com';
  const type = location.state?.type || 'signup';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpComplete = async (value: string) => {
    setOtp(value);
    setError('');
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setVerifying(true);
    
    try {
      const { data, error: verifyError } = await supabase.functions.invoke('verify-otp', {
        body: { email, otp }
      });

      if (verifyError) throw verifyError;
      
      if (data?.success) {
        // Get pending signup data and complete registration
        const pendingData = localStorage.getItem('motimate_pending_signup');
        if (pendingData) {
          const { name, email: signupEmail, password, educationData } = JSON.parse(pendingData);
          
          // Sign up the user
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: signupEmail,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
              data: { full_name: name }
            }
          });

          if (signupError) {
            setError(signupError.message);
            toast.error(signupError.message);
            setVerifying(false);
            return;
          }

          // Update profile with education data
          if (signupData.user && educationData) {
            await supabase.from('profiles').update({
              full_name: name,
              ...educationData
            }).eq('user_id', signupData.user.id);
          }

          localStorage.removeItem('motimate_pending_signup');
          localStorage.removeItem('motimate_education');
        }

        toast.success('Account verified successfully! 🎉');
        navigate('/dashboard', { replace: true });
      } else {
        setError(data?.error || 'Invalid OTP. Please try again.');
        toast.error(data?.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      const { error } = await supabase.functions.invoke('send-otp', {
        body: { email, type }
      });
      
      if (error) throw error;
      
      toast.success('OTP resent to your email!');
      setResendTimer(60);
      setCanResend(false);
      setError('');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="mobile-container min-h-screen flex flex-col">
      <motion.button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-muted/50"
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={24} />
      </motion.button>

      <div className="flex-1 flex flex-col items-center px-6 pt-24">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        >
          <Mail size={36} className="text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">Enter 6-digit OTP</h1>
          <p className="text-muted-foreground">
            We sent a verification code to<br />
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full mb-8"
        >
          <OtpInput
            length={6}
            onComplete={handleOtpComplete}
            error={error}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          {canResend ? (
            <button
              onClick={handleResend}
              className="flex items-center gap-2 text-primary font-medium mx-auto"
            >
              <RefreshCw size={18} />
              Resend OTP
            </button>
          ) : (
            <p className="text-muted-foreground">
              Resend OTP in <span className="text-primary font-semibold">{resendTimer}s</span>
            </p>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2"
        >
          Demo: Use OTP <span className="font-mono font-bold text-primary">123456</span>
        </motion.p>
      </div>

      <div className="px-6 pb-8">
        <MotiButton onClick={handleVerify} size="full" loading={isLoading || verifying}>
          Verify OTP
        </MotiButton>
      </div>
    </div>
  );
}
