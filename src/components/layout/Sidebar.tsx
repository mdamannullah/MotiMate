import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Brain, 
  BarChart3, 
  User, 
  Settings, 
  LogOut, 
  Crown,
  Bell,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import splashMascot from '@/assets/splash-mascot.png';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/tests', icon: BookOpen, label: 'Tests' },
  { path: '/ai-tutor', icon: Brain, label: 'AI Tutor' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const secondaryItems = [
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { notifications, stats } = useData();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student';

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/home', { replace: true });
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-border h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <motion.img 
            src={splashMascot} 
            alt="MotiMate" 
            className="w-12 h-12"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div>
            <h1 className="font-bold text-xl gradient-text">MotiMate</h1>
            <p className="text-xs text-muted-foreground">AI Study Companion</p>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="mx-4 mb-4">
        <motion.div 
          className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 cursor-pointer"
          onClick={() => navigate('/profile')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </div>
          
          {/* Stats Row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <div className="text-center">
              <p className="font-bold text-primary">{stats.testsCompleted}</p>
              <p className="text-xs text-muted-foreground">Tests</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-primary">{stats.avgScore || 0}%</p>
              <p className="text-xs text-muted-foreground">Avg</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-primary">{stats.studyHours}h</p>
              <p className="text-xs text-muted-foreground">Hours</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted text-foreground'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
              {item.path === '/ai-tutor' && !isActive && (
                <Sparkles size={14} className="ml-auto text-primary" />
              )}
            </motion.button>
          );
        })}

        {/* Secondary Navigation */}
        <div className="pt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Account
          </p>
          {secondaryItems.map((item) => {
            const isActive = location.pathname === item.path;
            const showBadge = item.path === '/notifications' && unreadCount > 0;
            
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-foreground'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <item.icon size={20} />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Upgrade Card */}
        <motion.div 
          onClick={() => navigate('/subscription')}
          className="bg-gradient-to-r from-primary to-primary-light p-4 rounded-2xl text-primary-foreground cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Crown size={18} />
            <span className="font-bold">Upgrade to Pro</span>
          </div>
          <p className="text-xs opacity-90">Unlock unlimited tests & features</p>
        </motion.div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-destructive hover:bg-destructive/10 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </aside>
  );
}
