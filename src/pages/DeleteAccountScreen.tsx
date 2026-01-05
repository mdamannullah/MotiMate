import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'confirm' | 'success';

export default function DeleteAccountScreen() {
  const navigate = useNavigate();
  const { deleteAccount, isLoading } = useAuth();
  
  const [step, setStep] = useState<Step>('confirm');

  const handleDelete = async () => {
    const result = await deleteAccount();
    
    if (result.success) {
      setStep('success');
    } else {
      toast.error(result.error || 'Failed to delete account');
    }
  };

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
          onClick={handleDelete} 
          size="full"
          loading={isLoading}
          className="bg-destructive hover:bg-destructive/90"
        >
          Delete My Account
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
