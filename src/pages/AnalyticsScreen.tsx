import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { MotiCard } from '@/components/ui/MotiCard';
import { ProgressCircle } from '@/components/ui/ProgressCircle';
import { Trophy, TrendingUp, Target, Calendar, BookOpen, Brain, Lightbulb } from 'lucide-react';

// Demo analytics data
const weeklyData = [
  { day: 'Mon', score: 75 },
  { day: 'Tue', score: 82 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 90 },
  { day: 'Fri', score: 85 },
  { day: 'Sat', score: 78 },
  { day: 'Sun', score: 88 },
];

const stats = [
  { label: 'Tests Taken', value: '24', icon: BookOpen, color: 'bg-primary/10 text-primary' },
  { label: 'Avg Score', value: '82%', icon: Target, color: 'bg-success/10 text-success' },
  { label: 'Study Hours', value: '48h', icon: Calendar, color: 'bg-primary/10 text-primary' },
  { label: 'Notes Created', value: '15', icon: Brain, color: 'bg-accent-foreground/10 text-accent-foreground' },
];

const aiTips = [
  'Focus more on Physics - your scores dropped this week',
  'Great progress in Math! Keep practicing calculus',
  'Try taking tests in the morning for better focus',
];

export default function AnalyticsScreen() {
  const overallScore = 82;
  const maxScore = Math.max(...weeklyData.map(d => d.score));

  return (
    <div className="mobile-container min-h-screen pb-24">
      <AppHeader title="Analytics" showNotification />

      <main className="px-4 py-4 space-y-6">
        {/* Overall Progress */}
        <MotiCard delay={0.1}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Overall Performance</h3>
              <p className="text-sm text-muted-foreground">Your weekly average</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp size={16} className="text-success" />
                <span className="text-success text-sm font-medium">+5% from last week</span>
              </div>
            </div>
            <ProgressCircle progress={overallScore} size={90} />
          </div>
        </MotiCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <MotiCard key={stat.label} delay={0.2 + index * 0.05}>
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </MotiCard>
          ))}
        </div>

        {/* Weekly Progress Chart */}
        <div>
          <h3 className="font-semibold mb-3">Weekly Progress</h3>
          <MotiCard delay={0.4}>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyData.map((data, index) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.score / 100) * 80}px` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 bg-primary ${
                        data.score === maxScore ? 'bg-success' : ''
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                    />
                  </motion.div>
                  <span className="text-xs text-muted-foreground">{data.day}</span>
                </div>
              ))}
            </div>
          </MotiCard>
        </div>

        {/* AI Tips */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className="text-primary" />
            <h3 className="font-semibold">AI Study Tips</h3>
          </div>
          <div className="space-y-2">
            {aiTips.map((tip, index) => (
              <MotiCard key={index} delay={0.6 + index * 0.1}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              </MotiCard>
            ))}
          </div>
        </div>

        {/* Recent Tests Summary */}
        <div>
          <h3 className="font-semibold mb-3">Subject Breakdown</h3>
          <MotiCard delay={0.8}>
            <div className="space-y-4">
              {[
                { subject: 'Physics', score: 78, color: 'bg-primary' },
                { subject: 'Chemistry', score: 85, color: 'bg-success' },
                { subject: 'Mathematics', score: 92, color: 'bg-primary' },
                { subject: 'Biology', score: 70, color: 'bg-destructive' },
              ].map((item) => (
                <div key={item.subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.subject}</span>
                    <span className="font-medium">{item.score}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.8, delay: 0.9 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </MotiCard>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
