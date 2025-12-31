import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { MotiCard } from '@/components/ui/MotiCard';
import { useData } from '@/contexts/DataContext';
import { BookOpen, Clock, Trophy, Play, History, TrendingUp } from 'lucide-react';

// Available tests data
const availableTests = [
  { 
    id: '1', 
    subject: 'Physics', 
    topic: "Newton's Laws", 
    questions: 10, 
    duration: 20,
    difficulty: 'Medium'
  },
  { 
    id: '2', 
    subject: 'Chemistry', 
    topic: 'Periodic Table', 
    questions: 10, 
    duration: 15,
    difficulty: 'Easy'
  },
  { 
    id: '3', 
    subject: 'Mathematics', 
    topic: 'Calculus Basics', 
    questions: 10, 
    duration: 30,
    difficulty: 'Hard'
  },
  { 
    id: '4', 
    subject: 'Biology', 
    topic: 'Cell Structure', 
    questions: 10, 
    duration: 18,
    difficulty: 'Medium'
  },
];

export default function TestsScreen() {
  const navigate = useNavigate();
  const { testHistory, stats } = useData();
  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success bg-success/10';
      case 'Medium': return 'text-primary bg-primary/10';
      case 'Hard': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    return 'text-destructive';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg px-4 py-4 border-b border-border">
          <h1 className="text-xl font-bold">Tests</h1>
          <p className="text-sm text-muted-foreground">
            Practice and track your progress
          </p>
        </header>

        {/* Stats Summary */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            <MotiCard delay={0}>
              <div className="text-center">
                <Trophy size={20} className="mx-auto text-primary mb-1" />
                <p className="text-xl font-bold">{stats.testsCompleted}</p>
                <p className="text-xs text-muted-foreground">Tests Taken</p>
              </div>
            </MotiCard>
            <MotiCard delay={0.05}>
              <div className="text-center">
                <TrendingUp size={20} className="mx-auto text-success mb-1" />
                <p className="text-xl font-bold">{stats.avgScore || 0}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </MotiCard>
            <MotiCard delay={0.1}>
              <div className="text-center">
                <Clock size={20} className="mx-auto text-primary mb-1" />
                <p className="text-xl font-bold">{stats.studyHours}h</p>
                <p className="text-xs text-muted-foreground">Study Time</p>
              </div>
            </MotiCard>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-2">
          <div className="flex bg-muted rounded-xl p-1">
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'available' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground'
              }`}
            >
              Available Tests
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === 'history' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground'
              }`}
            >
              History
              {testHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {testHistory.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <main className="px-4 py-3">
          <AnimatePresence mode="wait">
            {activeTab === 'available' ? (
              <motion.div
                key="available"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                {availableTests.map((test, index) => (
                  <MotiCard
                    key={test.id}
                    delay={index * 0.05}
                    onClick={() => navigate(`/test/${test.id}`)}
                    className="cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen size={22} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold">{test.subject}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(test.difficulty)}`}>
                            {test.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{test.topic}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen size={12} /> {test.questions} Qs
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {test.duration} min
                          </span>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-button flex-shrink-0"
                      >
                        <Play size={18} className="text-primary-foreground ml-0.5" />
                      </motion.div>
                    </div>
                  </MotiCard>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {testHistory.length > 0 ? (
                  testHistory.map((test, index) => (
                    <MotiCard key={test.id} delay={index * 0.05}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          test.percentage >= 80 ? 'bg-success/10' : 
                          test.percentage >= 60 ? 'bg-primary/10' : 'bg-destructive/10'
                        }`}>
                          <History size={22} className={
                            test.percentage >= 80 ? 'text-success' : 
                            test.percentage >= 60 ? 'text-primary' : 'text-destructive'
                          } />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">{test.subject}</h3>
                          <p className="text-sm text-muted-foreground truncate">{test.topic}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(test.timestamp)}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-2xl font-bold ${getScoreColor(test.percentage)}`}>
                            {test.percentage}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {test.score}/{test.total}
                          </p>
                        </div>
                      </div>
                    </MotiCard>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                      <Trophy size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">No tests taken yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Take your first test to start tracking your progress!
                    </p>
                    <button
                      onClick={() => setActiveTab('available')}
                      className="text-primary font-medium"
                    >
                      View Available Tests →
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </AppLayout>
  );
}
