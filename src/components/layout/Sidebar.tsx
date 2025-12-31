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
  FileText,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import splashMascot from '@/assets/splash-mascot.png';

// Desktop sidebar navigation
const navItems = [
  { path: '/dashboard', icon: Home, label: 'Overview' },
  { path: '/tests', icon: BookOpen, label: 'Tests' },
  { path: '/ai-tutor', icon: Brain, label: 'AI Tutor' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/notes', icon: FileText, label: 'My Notes' },
];

const bottomItems = [
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications } = useData();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/home', { replace: true });
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={splashMascot} alt="MotiMate" className="w-10 h-10" />
          <span className="font-bold text-xl gradient-text">MotiMate</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">
              {user?.name?.charAt(0) || 'S'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{user?.name || 'Student'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            user?.subscription === 'free' 
              ? 'bg-muted text-muted-foreground' 
              : 'bg-primary/10 text-primary'
          }`}>
            <Crown size={12} />
            {user?.subscription === 'free' ? 'Free Plan' : 'Pro Plan'}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted text-foreground'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-border space-y-1">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          const showBadge = item.path === '/notifications' && unreadCount > 0;
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
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

        {/* Profile */}
        <motion.button
          onClick={() => navigate('/profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
            location.pathname === '/profile'
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted text-foreground'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <User size={20} />
          <span className="font-medium">Profile</span>
        </motion.button>

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

      {/* Upgrade Card */}
      {user?.subscription === 'free' && (
        <div className="p-4">
          <div 
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-primary to-primary-light p-4 rounded-2xl text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity"
          >
            <p className="font-bold mb-1">Upgrade to Pro</p>
            <p className="text-xs opacity-90">Unlock unlimited features</p>
          </div>
        </div>
      )}
    </aside>
  );
}
