import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { MotiCard } from '@/components/ui/MotiCard';
import { MotiButton } from '@/components/ui/MotiButton';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { User, Mail, Crown, Settings, FileText, Star, ChevronRight, LogOut, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { stats } = useData();

  const menuItems = [
    { icon: FileText, label: 'My Notes', path: '/notes' },
    { icon: Star, label: 'Subscription', path: '/subscription' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="lg:hidden">
        <AppHeader title="Profile" showNotification />
      </div>

      <main className="px-4 py-4 space-y-6 lg:px-8">
        {/* Profile Card */}
        <MotiCard delay={0.1}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <span className="text-primary font-bold text-2xl">{user?.name?.charAt(0) || 'S'}</span>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Edit2 size={14} />
              </motion.button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user?.name || 'Student'}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-1 mt-2">
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${user?.subscription === 'free' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                  <Crown size={12} />
                  {user?.subscription === 'free' ? 'Free Plan' : 'Pro Plan'}
                </div>
              </div>
            </div>
          </div>
        </MotiCard>

        {/* Contact Info - Only Email */}
        <div>
          <h3 className="font-semibold mb-3">Contact Information</h3>
          <MotiCard delay={0.2}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </MotiCard>
        </div>

        {/* Quick Stats - from actual data */}
        <div>
          <h3 className="font-semibold mb-3">Your Stats</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Tests', value: stats.testsCompleted.toString() },
              { label: 'Notes', value: stats.notesCreated.toString() },
              { label: 'Avg Score', value: stats.avgScore > 0 ? `${stats.avgScore}%` : '0%' },
            ].map((stat, index) => (
              <MotiCard key={stat.label} delay={0.3 + index * 0.05}>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </MotiCard>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <MotiCard key={item.label} delay={0.4 + index * 0.05} onClick={() => navigate(item.path)} className="cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon size={18} className="text-primary" />
                </div>
                <span className="flex-1 font-medium">{item.label}</span>
                <ChevronRight size={18} className="text-muted-foreground" />
              </div>
            </MotiCard>
          ))}
        </div>

        <MotiButton onClick={handleLogout} variant="outline" size="full" icon={<LogOut size={18} />} className="border-destructive text-destructive hover:bg-destructive/5">
          Logout
        </MotiButton>
      </main>

      <BottomNav />
    </div>
  );
}
