import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Brain, BarChart3, User } from 'lucide-react';
import { motion } from 'framer-motion';

// Bottom navigation items - dashboard ke baad dikhenge
const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/tests', icon: BookOpen, label: 'Tests' },
  { path: '/ai-tutor', icon: Brain, label: 'AI Tutor' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <motion.button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={isActive ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Icon size={22} />
            </motion.div>
            <span className="text-xs font-medium">{item.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 400 }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
