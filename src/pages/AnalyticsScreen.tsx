import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { MotiCard } from '@/components/ui/MotiCard';
import { ProgressCircle } from '@/components/ui/ProgressCircle';
import { useData } from '@/contexts/DataContext';
import { TrendingUp, TrendingDown, Target, Calendar, BookOpen, Brain, Lightbulb, Award } from 'lucide-react';

export default function AnalyticsScreen() {
  const { stats, weeklyData, subjectScores, getAiTips, testHistory } = useData();

  const aiTips = getAiTips();
  const hasData = stats.testsCompleted > 0;
  
  // Calculate max score for chart
  const maxScore = Math.max(...weeklyData.map(d => d.score), 1);
  const hasWeeklyData = weeklyData.some(d => d.score > 0);

  // Get subject breakdown from real data
  const subjectBreakdown = Object.values(subjectScores).map(s => ({
    subject: s.subject,
    score: s.avgScore,
    color: s.avgScore >= 80 ? 'bg-success' : s.avgScore >= 60 ? 'bg-primary' : 'bg-destructive',
  }));

  // Calculate trend (compare last 3 tests with previous 3)
  const recentTests = testHistory.slice(0, 3);
  const olderTests = testHistory.slice(3, 6);
  const recentAvg = recentTests.length > 0 
    ? recentTests.reduce((a, b) => a + b.percentage, 0) / recentTests.length 
    : 0;
  const olderAvg = olderTests.length > 0 
    ? olderTests.reduce((a, b) => a + b.percentage, 0) / olderTests.length 
    : recentAvg;
  const trend = recentAvg - olderAvg;
  const isImproving = trend >= 0;

  const statCards = [
    { label: 'Tests Taken', value: stats.testsCompleted.toString(), icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { label: 'Avg Score', value: `${stats.avgScore || 0}%`, icon: Target, color: 'bg-success/10 text-success' },
    { label: 'Study Hours', value: `${stats.studyHours}h`, icon: Calendar, color: 'bg-primary/10 text-primary' },
    { label: 'Notes Created', value: stats.notesCreated.toString(), icon: Brain, color: 'bg-accent-foreground/10 text-accent-foreground' },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg px-4 py-4 border-b border-border">
          <h1 className="text-xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track your learning progress
          </p>
        </header>

        <main className="px-4 py-4 space-y-6">
          {/* Overall Progress */}
          <MotiCard delay={0.1}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Overall Performance</h3>
                <p className="text-sm text-muted-foreground">
                  {hasData ? 'Your average score' : 'Start taking tests!'}
                </p>
                {hasData && (
                  <div className="flex items-center gap-2 mt-2">
                    {isImproving ? (
                      <TrendingUp size={16} className="text-success" />
                    ) : (
                      <TrendingDown size={16} className="text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${isImproving ? 'text-success' : 'text-destructive'}`}>
                      {trend > 0 ? '+' : ''}{Math.round(trend)}% from previous
                    </span>
                  </div>
                )}
              </div>
              <ProgressCircle progress={stats.avgScore || 0} size={90} />
            </div>
          </MotiCard>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((stat, index) => (
              <MotiCard key={stat.label} delay={0.15 + index * 0.05}>
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
            <MotiCard delay={0.3}>
              {hasWeeklyData ? (
                <div className="flex items-end justify-between h-32 gap-2">
                  {weeklyData.map((data, index) => (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        className="w-full bg-muted rounded-t-lg relative overflow-hidden"
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max((data.score / 100) * 80, 4)}px` }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      >
                        <motion.div
                          className={`absolute bottom-0 left-0 right-0 ${
                            data.score >= 80 ? 'bg-success' : 
                            data.score >= 60 ? 'bg-primary' : 
                            data.score > 0 ? 'bg-destructive' : 'bg-muted'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                        />
                      </motion.div>
                      <span className="text-xs text-muted-foreground">{data.day}</span>
                      {data.score > 0 && (
                        <span className="text-xs font-medium">{data.score}%</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Award size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Take tests to see your weekly progress</p>
                  </div>
                </div>
              )}
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
                <MotiCard key={index} delay={0.5 + index * 0.1}>
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

          {/* Subject Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">Subject Breakdown</h3>
            <MotiCard delay={0.7}>
              {subjectBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {subjectBreakdown.map((item) => (
                    <div key={item.subject}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.subject}</span>
                        <span className={`font-medium ${
                          item.score >= 80 ? 'text-success' : 
                          item.score >= 60 ? 'text-primary' : 'text-destructive'
                        }`}>
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${item.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Complete tests to see subject breakdown</p>
                </div>
              )}
            </MotiCard>
          </div>

          {/* Recent Performance */}
          {testHistory.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Recent Tests</h3>
              <div className="space-y-2">
                {testHistory.slice(0, 5).map((test, index) => (
                  <MotiCard key={test.id} delay={0.9 + index * 0.05}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{test.subject}</p>
                        <p className="text-xs text-muted-foreground">{test.topic}</p>
                      </div>
                      <div className={`text-lg font-bold ${
                        test.percentage >= 80 ? 'text-success' : 
                        test.percentage >= 60 ? 'text-primary' : 'text-destructive'
                      }`}>
                        {test.percentage}%
                      </div>
                    </div>
                  </MotiCard>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
