import { motion } from 'framer-motion';
import { Copy, Check, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface OtpNotificationProps {
  otp: string;
  email: string;
  onClose?: () => void;
}

// OTP Notification Component - Email jaisa dikhta hai, OTP prominently display karta hai
export const OtpNotification = ({ otp, email }: OtpNotificationProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    toast.success('OTP copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Email simulation card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        {/* Email header */}
        <div className="bg-primary/10 px-4 py-3 flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Mail size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">MotiMate Security</p>
            <p className="text-xs text-muted-foreground">noreply@motimate.app</p>
          </div>
        </div>

        {/* Email body */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Your verification code for <span className="font-medium text-foreground">{email}</span>
          </p>

          {/* OTP Display - Prominent and copyable */}
          <div 
            onClick={handleCopy}
            className="bg-muted/50 border-2 border-dashed border-primary/30 rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors group"
          >
            <p className="text-xs text-muted-foreground text-center mb-2">
              Your OTP Code (tap to copy)
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-mono font-bold tracking-[0.5em] text-primary">
                {otp}
              </span>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors"
              >
                {copied ? (
                  <Check size={18} className="text-success" />
                ) : (
                  <Copy size={18} className="text-primary" />
                )}
              </motion.div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            ⏱️ This code expires in 5 minutes
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Toast function to show OTP notification - Sonner toast ke andar OTP dikhata hai
export const showOtpNotification = (otp: string, email: string) => {
  // Console mein bhi OTP dikha do for debugging
  console.log('🔐 Your OTP Code:', otp);
  
  toast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="w-full"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-w-sm mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center animate-pulse">
              <Mail size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">📧 Email Received!</p>
              <p className="text-xs text-muted-foreground">From: MotiMate Security</p>
            </div>
            <button 
              onClick={() => toast.dismiss(t)}
              className="text-muted-foreground hover:text-foreground text-xl"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Verification code for <span className="font-medium text-foreground">{email}</span>
            </p>

            {/* OTP - Big and Bold */}
            <CopyableOtp otp={otp} />

            <p className="text-xs text-muted-foreground text-center">
              ⏱️ Expires in 5 minutes • Demo mode enabled
            </p>
          </div>
        </div>
      </motion.div>
    ),
    {
      duration: 15000, // 15 seconds - zyada time dikhega
      position: 'top-center',
    }
  );
};

// Copyable OTP component - Click karne par copy ho jata hai
const CopyableOtp = ({ otp }: { otp: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      onClick={handleCopy}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-r from-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all group"
    >
      <div className="flex items-center justify-center gap-3">
        <span className="text-4xl font-mono font-black tracking-[0.4em] text-primary pl-4">
          {otp}
        </span>
        <motion.div
          animate={copied ? { scale: [1, 1.2, 1] } : {}}
          className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors"
        >
          {copied ? (
            <Check size={20} className="text-success" />
          ) : (
            <Copy size={20} className="text-primary" />
          )}
        </motion.div>
      </div>
      <p className="text-xs text-center text-muted-foreground mt-2">
        {copied ? '✓ Copied!' : 'Tap to copy'}
      </p>
    </motion.div>
  );
};
