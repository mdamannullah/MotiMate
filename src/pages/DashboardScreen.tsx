import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { MotiCard } from '@/components/ui/MotiCard';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { 
  BookOpen, 
  Brain, 
  BarChart3, 
  Mic, 
  FileText,
  Trophy,
  Clock,
  ArrowRight
} from 'lucide-react';
import aiTutorAvatar from '@/assets/ai-tutor-avatar.png';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { stats, testHistory } = useData();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student';

  const quickActions = [
    { icon: Mic, label: 'Live Translate', desc: 'Translate lectures', path: '/live-translate', color: 'bg-primary/10 text-primary' },
    { icon: FileText, label: 'Smart Notes', desc: 'AI-generated notes', path: '/notes', color: 'bg-success/10 text-success' },
    { icon: BookOpen, label: 'Take Test', desc: 'Practice MCQs', path: '/tests', color: 'bg-accent-foreground/10 text-accent-foreground' },
    { icon: BarChart3, label: 'Analytics', desc: 'View progress', path: '/analytics', color: 'bg-primary/10 text-primary' },
  ];

  const recentActivity = testHistory.slice(0, 3).map(test => ({
    type: 'test' as const,
    title: `${test.subject} Test`,
    score: `${test.percentage}%`,
    time: test.date,
  }));

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="lg:hidden">
        <AppHeader showNotification showSettings />
      </div>

      <main className="px-4 py-4 space-y-6 lg:px-8 lg:py-6">
        {/* Welcome section */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Welcome back,</p>
            <h2 className="text-xl font-bold">{displayName} 👋</h2>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/profile')} className="cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              <span className="text-primary font-bold text-lg">{displayName.charAt(0).toUpperCase()}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* AI Tutor Card */}
        <MotiCard className="relative overflow-hidden cursor-pointer" onClick={() => navigate('/ai-tutor')} delay={0.1}>
          <div className="flex items-center gap-4">
            <motion.img src={aiTutorAvatar} alt="AI Tutor" className="w-20 h-20 object-contain" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Chat with AI Tutor</h3>
              <p className="text-sm text-muted-foreground">Ask questions, get help with studies</p>
            </div>
            <ArrowRight className="text-primary" size={20} />
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
        </MotiCard>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <MotiCard key={action.label} className="cursor-pointer" onClick={() => navigate(action.path)} delay={0.2 + index * 0.05}>
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon size={20} />
                </div>
                <h4 className="font-semibold text-sm">{action.label}</h4>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </MotiCard>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div>
          <h3 className="font-semibold mb-3">Your Progress</h3>
          <MotiCard delay={0.4}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Trophy size={20} className="text-primary" />
                </div>
                <p className="font-bold">{stats.testsCompleted}</p>
                <p className="text-xs text-muted-foreground">Tests Done</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-2">
                  <FileText size={20} className="text-success" />
                </div>
                <p className="font-bold">{stats.notesCreated}</p>
                <p className="text-xs text-muted-foreground">Notes Created</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Clock size={20} className="text-primary" />
                </div>
                <p className="font-bold">{stats.studyHours}h</p>
                <p className="text-xs text-muted-foreground">Study Time</p>
              </div>
            </div>
          </MotiCard>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <MotiCard key={index} delay={0.5 + index * 0.05}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.score}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </MotiCard>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
