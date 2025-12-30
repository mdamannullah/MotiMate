import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { MotiCard } from '@/components/ui/MotiCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Moon, 
  Sun, 
  Bell, 
  Lock, 
  Globe, 
  HelpCircle, 
  FileText,
  ChevronRight,
  Trash2,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        { 
          icon: theme === 'dark' ? Moon : Sun, 
          label: 'Dark Mode', 
          action: 'toggle',
          value: theme === 'dark'
        },
        { icon: Bell, label: 'Notifications', action: 'navigate', path: '/notifications' },
        { icon: Globe, label: 'Language', action: 'navigate', value: 'English' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: Lock, label: 'Change Password', action: 'navigate', path: '/change-password' },
        { icon: Shield, label: 'Privacy Settings', action: 'navigate' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', action: 'navigate', path: '/help' },
        { icon: FileText, label: 'Terms & Conditions', action: 'navigate' },
      ],
    },
  ];

  const handleToggle = (label: string) => {
    if (label === 'Dark Mode') {
      toggleTheme();
      toast.success(`${theme === 'dark' ? 'Light' : 'Dark'} mode enabled`);
    }
  };

  return (
    <div className="mobile-container min-h-screen pb-8">
      <AppHeader title="Settings" showBack />

      <main className="px-4 py-4 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <div key={group.title}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.items.map((item, index) => (
                <MotiCard 
                  key={item.label} 
                  delay={groupIndex * 0.1 + index * 0.05}
                  onClick={item.action === 'toggle' ? () => handleToggle(item.label) : undefined}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.action === 'toggle' ? (
                      <motion.div
                        className={`w-12 h-7 rounded-full p-1 transition-colors ${
                          item.value ? 'bg-primary' : 'bg-muted'
                        }`}
                        onClick={() => handleToggle(item.label)}
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-white shadow"
                          animate={{ x: item.value ? 20 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {item.value && (
                          <span className="text-sm text-muted-foreground">{item.value}</span>
                        )}
                        <ChevronRight size={18} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </MotiCard>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div>
          <h3 className="font-semibold text-sm text-destructive mb-3 uppercase tracking-wide">
            Danger Zone
          </h3>
          <MotiCard 
            delay={0.5}
            className="border border-destructive/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Trash2 size={18} className="text-destructive" />
              </div>
              <span className="flex-1 font-medium text-destructive">Delete Account</span>
              <ChevronRight size={18} className="text-destructive" />
            </div>
          </MotiCard>
        </div>

        {/* App Version */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">MotiMate v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">Made with ❤️ for Indian Students</p>
        </div>
      </main>
    </div>
  );
}
