import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Settings, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showNotification?: boolean;
  showSettings?: boolean;
  transparent?: boolean;
}

// Page titles mapping
const pageTitles: Record<string, string> = {
  '/dashboard': 'MotiMate',
  '/tests': 'Tests',
  '/ai-tutor': 'AI Tutor',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/notes': 'My Notes',
};

export function AppHeader({
  title,
  showBack = false,
  showMenu = false,
  showNotification = true,
  showSettings = false,
  transparent = false,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Page title automatically detect karte hain agar title prop nahi diya
  const displayTitle = title || pageTitles[location.pathname] || 'MotiMate';

  return (
    <header className={`app-header ${transparent ? 'bg-transparent' : ''}`}>
      {/* Left side - Back button ya Menu */}
      <div className="flex items-center gap-2">
        {showBack && (
          <motion.button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={24} />
          </motion.button>
        )}
        {showMenu && (
          <motion.button
            className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} />
          </motion.button>
        )}
        <h1 className="text-xl font-bold">{displayTitle}</h1>
      </div>

      {/* Right side - Notification aur Settings */}
      <div className="flex items-center gap-1">
        {showNotification && (
          <motion.button
            className="p-2 rounded-full hover:bg-muted/50 transition-colors relative"
            whileTap={{ scale: 0.9 }}
          >
            <Bell size={22} />
            {/* Notification dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </motion.button>
        )}
        {showSettings && (
          <motion.button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <Settings size={22} />
          </motion.button>
        )}
      </div>
    </header>
  );
}
