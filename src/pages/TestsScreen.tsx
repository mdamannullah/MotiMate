import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { MotiCard } from '@/components/ui/MotiCard';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { getTests, Test } from '@/services/mockData';
import { BookOpen, Clock, Trophy, Play, History, TrendingUp, Loader2 } from 'lucide-react';

export default function TestsScreen() {
  const navigate = useNavigate();
  const { stats, testHistory } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTests(getTests());
    setLoading(false);
  }, []);

  const getDifficultyFromDuration = (duration: number | null) => {
    if (!duration) return 'Medium';
    if (duration <= 15) return 'Easy';
    if (duration <= 25) return 'Medium';
    return 'Hard';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success bg-success/10';
      case 'Medium': return 'text-primary bg-primary/10';
      case 'Hard': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-primary';
    return 'text-destructive';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (<AppLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AppLayout>);
  }

  return (
    <AppLayout>
      <div className="min-h-screen pb-24 lg:pb-8">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg px-4 py-4 border-b border-border"><h1 className="text-xl font-bold">Tests</h1><p className="text-sm text-muted-foreground">Practice and track your progress</p></header>

        <div className="px-4 py-4"><div className="grid grid-cols-3 gap-3">
          <MotiCard delay={0}><div className="text-center"><Trophy size={20} className="mx-auto text-primary mb-1" /><p className="text-xl font-bold">{stats.testsCompleted}</p><p className="text-xs text-muted-foreground">Tests Taken</p></div></MotiCard>
          <MotiCard delay={0.05}><div className="text-center"><TrendingUp size={20} className="mx-auto text-success mb-1" /><p className="text-xl font-bold">{stats.avgScore || 0}%</p><p className="text-xs text-muted-foreground">Avg Score</p></div></MotiCard>
          <MotiCard delay={0.1}><div className="text-center"><Clock size={20} className="mx-auto text-primary mb-1" /><p className="text-xl font-bold">{stats.studyHours}h</p><p className="text-xs text-muted-foreground">Study Time</p></div></MotiCard>
        </div></div>

        <div className="px-4 py-2"><div className="flex bg-muted rounded-xl p-1">
          <button onClick={() => setActiveTab('available')} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'available' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>Available Tests</button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>History{testHistory.length > 0 && (<span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">{testHistory.length}</span>)}</button>
        </div></div>

        <main className="px-4 py-3">
          <AnimatePresence mode="wait">
            {activeTab === 'available' ? (
              <motion.div key="available" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
                {tests.length > 0 ? tests.map((test, index) => {
                  const difficulty = getDifficultyFromDuration(test.duration_minutes);
                  return (
                    <MotiCard key={test.id} delay={index * 0.05} onClick={() => navigate(`/test/${test.id}`)} className="cursor-pointer hover:border-primary transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><BookOpen size={22} className="text-primary" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap"><h3 className="font-semibold">{test.subject}</h3><span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(difficulty)}`}>{difficulty}</span></div>
                          <p className="text-sm text-muted-foreground truncate">{test.title}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground"><span className="flex items-center gap-1"><BookOpen size={12} /> {test.total_questions || 10} Qs</span><span className="flex items-center gap-1"><Clock size={12} /> {test.duration_minutes || 30} min</span></div>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-button flex-shrink-0"><Play size={18} className="text-primary-foreground ml-0.5" /></motion.div>
                      </div>
                    </MotiCard>
                  );
                }) : (<div className="text-center py-16"><div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4"><BookOpen size={32} className="text-muted-foreground" /></div><h3 className="font-semibold mb-2">No tests available</h3><p className="text-sm text-muted-foreground">Check back later for new tests!</p></div>)}
              </motion.div>
            ) : (
              <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                {testHistory.length > 0 ? testHistory.map((result, index) => (
                  <MotiCard key={result.id} delay={index * 0.05}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${result.percentage >= 80 ? 'bg-success/10' : result.percentage >= 60 ? 'bg-primary/10' : 'bg-destructive/10'}`}><History size={22} className={result.percentage >= 80 ? 'text-success' : result.percentage >= 60 ? 'text-primary' : 'text-destructive'} /></div>
                      <div className="flex-1 min-w-0"><h3 className="font-semibold">{result.subject}</h3><p className="text-sm text-muted-foreground truncate">{result.topic}</p><p className="text-xs text-muted-foreground mt-1">{formatDate(result.timestamp)}</p></div>
                      <div className="text-right flex-shrink-0"><p className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>{result.percentage}%</p><p className="text-xs text-muted-foreground">{result.score}/{result.total}</p></div>
                    </div>
                  </MotiCard>
                )) : (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16"><div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4"><Trophy size={32} className="text-muted-foreground" /></div><h3 className="font-semibold mb-2">No tests taken yet</h3><p className="text-sm text-muted-foreground mb-6">Take your first test to start tracking your progress!</p><button onClick={() => setActiveTab('available')} className="text-primary font-medium">View Available Tests →</button></motion.div>)}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </AppLayout>
  );
}
