import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { MotiInput } from '@/components/ui/MotiInput';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ChangePasswordScreen() {
  const navigate = useNavigate();
  const { changePassword, isLoading } = useAuth();
  const { addNotification } = useData();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
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

  const handleSubmit = async () => {
    if (!validate()) return;

    const result = await changePassword(currentPassword, newPassword);
    
    if (result.success) {
      addNotification({
        type: 'password_change',
        title: 'Password Changed',
        message: 'Your password has been successfully updated',
      });
      toast.success('Password changed successfully!');
      setIsSuccess(true);
    } else {
      toast.error(result.error || 'Failed to change password');
      setErrors({ currentPassword: result.error || 'Incorrect password' });
    }
  };

  if (isSuccess) {
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
          <h1 className="text-2xl font-bold mb-2">Password Changed!</h1>
          <p className="text-muted-foreground">
            Your password has been successfully updated
          </p>
        </motion.div>

        <MotiButton onClick={() => navigate('/settings')} size="full">
          Back to Settings
        </MotiButton>
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen flex flex-col">
      {/* Back button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-muted/50 z-10"
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={24} />
      </motion.button>

      <div className="flex-1 flex flex-col px-6 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Change Password</h1>
          <p className="text-muted-foreground">Enter your current password and create a new one</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <MotiInput
            label="Current Password"
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
            icon={<Lock size={20} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="hover:text-foreground transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
          
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
      </div>

      {/* Submit button */}
      <div className="px-6 pb-8">
        <MotiButton onClick={handleSubmit} size="full" loading={isLoading}>
          Change Password
        </MotiButton>
      </div>
    </div>
  );
}
