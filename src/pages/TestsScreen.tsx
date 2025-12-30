import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { MotiCard } from '@/components/ui/MotiCard';
import { MotiButton } from '@/components/ui/MotiButton';
import { BookOpen, Clock, Trophy, ChevronRight, Play, History } from 'lucide-react';

// Demo tests data
const availableTests = [
  { 
    id: '1', 
    subject: 'Physics', 
    topic: 'Newton\'s Laws', 
    questions: 15, 
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
    questions: 20, 
    duration: 30,
    difficulty: 'Hard'
  },
  { 
    id: '4', 
    subject: 'Biology', 
    topic: 'Cell Structure', 
    questions: 12, 
    duration: 18,
    difficulty: 'Medium'
  },
];

// Demo test history
const testHistory = [
  { id: '1', subject: 'Physics', score: 85, total: 100, date: 'Today, 2:30 PM' },
  { id: '2', subject: 'Chemistry', score: 92, total: 100, date: 'Yesterday' },
  { id: '3', subject: 'Math', score: 78, total: 100, date: '2 days ago' },
];

export default function TestsScreen() {
  const navigate = useNavigate();
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
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-primary';
    return 'text-destructive';
  };

  return (
    <div className="mobile-container min-h-screen pb-24">
      <AppHeader title="Tests" showNotification />

      {/* Tabs */}
      <div className="px-4 py-3">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'available' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground'
            }`}
          >
            Available Tests
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'history' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground'
            }`}
          >
            History
          </button>
        </div>
      </div>

      <main className="px-4 py-2">
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
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen size={22} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{test.subject}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(test.difficulty)}`}>
                          {test.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{test.topic}</p>
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
                      whileHover={{ x: 5 }}
                      className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
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
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <History size={22} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{test.subject}</h3>
                        <p className="text-xs text-muted-foreground">{test.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${getScoreColor(test.score)}`}>
                          {test.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {test.score}/{test.total}
                        </p>
                      </div>
                    </div>
                  </MotiCard>
                ))
              ) : (
                <div className="text-center py-12">
                  <Trophy size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tests taken yet</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
