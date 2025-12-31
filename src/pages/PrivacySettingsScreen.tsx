import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { MotiCard } from '@/components/ui/MotiCard';
import { Shield, Eye, Lock, Database, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface PrivacySetting {
  id: string;
  icon: any;
  label: string;
  description: string;
  enabled: boolean;
}

export default function PrivacySettingsScreen() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: 'profile_visibility',
      icon: Eye,
      label: 'Profile Visibility',
      description: 'Allow others to view your profile and statistics',
      enabled: false,
    },
    {
      id: 'data_collection',
      icon: Database,
      label: 'Analytics Data',
      description: 'Help improve the app by sharing anonymous usage data',
      enabled: true,
    },
    {
      id: 'leaderboard',
      icon: Share2,
      label: 'Show on Leaderboard',
      description: 'Display your scores on public leaderboards',
      enabled: false,
    },
    {
      id: 'two_factor',
      icon: Lock,
      label: 'Two-Factor Authentication',
      description: 'Add extra security to your account',
      enabled: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
    toast.success('Setting updated');
  };

  return (
    <div className="mobile-container min-h-screen pb-8">
      <AppHeader title="Privacy Settings" showBack />

      <main className="px-4 py-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield size={32} className="text-primary" />
          </div>
          <h2 className="text-lg font-bold mb-1">Your Privacy Matters</h2>
          <p className="text-sm text-muted-foreground">
            Control how your data is used and shared
          </p>
        </motion.div>

        {/* Privacy Settings */}
        <div className="space-y-3">
          {settings.map((setting, index) => (
            <MotiCard
              key={setting.id}
              delay={index * 0.1}
              onClick={() => handleToggle(setting.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <setting.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </div>
                <motion.div
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${
                    setting.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow"
                    animate={{ x: setting.enabled ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.div>
              </div>
            </MotiCard>
          ))}
        </div>

        {/* Info */}
        <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
          <p>
            Your data is stored securely and never shared with third parties without your consent.
            You can request data deletion anytime from the settings.
          </p>
        </div>
      </main>
    </div>
  );
}
