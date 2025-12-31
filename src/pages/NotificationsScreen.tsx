import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppLayout } from '@/components/layout/AppLayout';
import { MotiCard } from '@/components/ui/MotiCard';
import { MotiButton } from '@/components/ui/MotiButton';
import { useData } from '@/contexts/DataContext';
import { 
  Bell, 
  LogIn, 
  UserPlus, 
  Lock, 
  Trophy, 
  Star, 
  Clock,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'login': return LogIn;
    case 'signup': return UserPlus;
    case 'password_change': return Lock;
    case 'test_completed': return Trophy;
    case 'achievement': return Star;
    default: return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'login': return 'bg-primary/10 text-primary';
    case 'signup': return 'bg-success/10 text-success';
    case 'password_change': return 'bg-primary/10 text-primary';
    case 'test_completed': return 'bg-success/10 text-success';
    case 'achievement': return 'bg-primary/10 text-primary';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function NotificationsScreen() {
  const { notifications, markNotificationRead, clearAllNotifications } = useData();

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  return (
    <AppLayout>
      <div className="mobile-container min-h-screen pb-24 lg:pb-8">
        <AppHeader title="Notifications" showBack />

        <main className="px-4 py-4 space-y-4">
          {/* Header Actions */}
          {notifications.length > 0 && (
            <div className="flex justify-end gap-2">
              <MotiButton
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                icon={<Trash2 size={16} />}
              >
                Clear All
              </MotiButton>
            </div>
          )}

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);

                return (
                  <MotiCard
                    key={notification.id}
                    delay={index * 0.05}
                    onClick={() => handleMarkRead(notification.id)}
                    className={`cursor-pointer ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </MotiCard>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4"
              >
                <Bell size={32} className="text-muted-foreground" />
              </motion.div>
              <h3 className="font-semibold mb-2">No notifications yet</h3>
              <p className="text-sm text-muted-foreground">
                Your notifications will appear here
              </p>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
