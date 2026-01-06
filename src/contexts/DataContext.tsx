import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface UserStats {
  testsCompleted: number;
  notesCreated: number;
  studyHours: number;
  avgScore: number;
  totalScore: number;
}

interface TestResult {
  id: string;
  subject: string;
  topic: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  timestamp: number;
}

interface Notification {
  id: string;
  type: 'login' | 'signup' | 'password_change' | 'test_completed' | 'achievement' | 'reminder' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface SubjectScore {
  subject: string;
  totalScore: number;
  testsCount: number;
  avgScore: number;
}

interface DataContextType {
  stats: UserStats;
  testHistory: TestResult[];
  notifications: Notification[];
  subjectScores: Record<string, SubjectScore>;
  weeklyData: { day: string; score: number }[];
  addTestResult: (result: Omit<TestResult, 'id' | 'timestamp'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  incrementNotes: () => void;
  addStudyTime: (minutes: number) => void;
  resetUserData: () => void;
  getAiTips: () => string[];
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const getInitialStats = (): UserStats => ({
  testsCompleted: 0,
  notesCreated: 0,
  studyHours: 0,
  avgScore: 0,
  totalScore: 0,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(getInitialStats);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subjectScores, setSubjectScores] = useState<Record<string, SubjectScore>>({});

  // Fetch data from Supabase when user changes
  const refreshData = useCallback(async () => {
    if (!user) {
      setStats(getInitialStats());
      setTestHistory([]);
      setNotifications([]);
      setSubjectScores({});
      return;
    }

    try {
      // Fetch test results
      const { data: testResults, error: testError } = await supabase
        .from('test_results')
        .select(`
          id,
          score,
          total_questions,
          completed_at,
          time_taken_seconds,
          tests (
            title,
            subject,
            description
          )
        `)
        .order('completed_at', { ascending: false });

      if (testError) throw testError;

      // Transform test results
      const history: TestResult[] = (testResults || []).map(r => ({
        id: r.id,
        subject: r.tests?.subject || 'Unknown',
        topic: r.tests?.title || r.tests?.description || 'Test',
        score: r.score,
        total: r.total_questions,
        percentage: Math.round((r.score / r.total_questions) * 100),
        date: r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Unknown',
        timestamp: r.completed_at ? new Date(r.completed_at).getTime() : Date.now()
      }));

      setTestHistory(history);

      // Calculate stats and subject scores
      let totalScore = 0;
      let totalTime = 0;
      const subjectMap: Record<string, SubjectScore> = {};

      history.forEach(result => {
        totalScore += result.percentage;
        
        if (!subjectMap[result.subject]) {
          subjectMap[result.subject] = {
            subject: result.subject,
            totalScore: 0,
            testsCount: 0,
            avgScore: 0
          };
        }
        subjectMap[result.subject].totalScore += result.percentage;
        subjectMap[result.subject].testsCount += 1;
      });

      // Calculate averages
      Object.keys(subjectMap).forEach(subject => {
        subjectMap[subject].avgScore = Math.round(
          subjectMap[subject].totalScore / subjectMap[subject].testsCount
        );
      });

      setSubjectScores(subjectMap);

      // Calculate study time from test results
      (testResults || []).forEach(r => {
        if (r.time_taken_seconds) {
          totalTime += r.time_taken_seconds;
        }
      });

      // Fetch notes count
      const { count: notesCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true });

      // Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      const formattedNotifications: Notification[] = (notificationsData || []).map(n => ({
        id: n.id,
        type: n.type as Notification['type'],
        title: n.title,
        message: n.message,
        timestamp: new Date(n.created_at || '').getTime(),
        read: n.is_read || false
      }));

      setNotifications(formattedNotifications);

      setStats({
        testsCompleted: history.length,
        notesCreated: notesCount || 0,
        studyHours: Math.round((totalTime / 3600) * 10) / 10,
        avgScore: history.length > 0 ? Math.round(totalScore / history.length) : 0,
        totalScore
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Weekly data calculate from test history
  const weeklyData = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekScores: { day: string; scores: number[] }[] = days.map(day => ({ day, scores: [] }));

    testHistory.forEach(test => {
      const testDate = new Date(test.timestamp);
      if (testDate >= weekStart) {
        const dayIndex = testDate.getDay();
        weekScores[dayIndex].scores.push(test.percentage);
      }
    });

    return weekScores.map(({ day, scores }) => ({
      day,
      score: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    }));
  }, [testHistory]);

  // Add test result (local state update - DB save happens in TakeTestScreen)
  const addTestResult = (result: Omit<TestResult, 'id' | 'timestamp'>) => {
    const newResult: TestResult = {
      ...result,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setTestHistory(prev => [newResult, ...prev]);

    // Update stats
    setStats(prev => {
      const newTotalScore = prev.totalScore + result.percentage;
      const newTestsCompleted = prev.testsCompleted + 1;
      return {
        ...prev,
        testsCompleted: newTestsCompleted,
        totalScore: newTotalScore,
        avgScore: Math.round(newTotalScore / newTestsCompleted),
      };
    });

    // Update subject scores
    setSubjectScores(prev => {
      const existing = prev[result.subject] || { subject: result.subject, totalScore: 0, testsCount: 0, avgScore: 0 };
      const newTotal = existing.totalScore + result.percentage;
      const newCount = existing.testsCount + 1;
      return {
        ...prev,
        [result.subject]: {
          subject: result.subject,
          totalScore: newTotal,
          testsCount: newCount,
          avgScore: Math.round(newTotal / newCount),
        },
      };
    });
  };

  // Add notification
  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: user.id,
        title: notification.title,
        message: notification.message,
        type: notification.type
      });

      if (error) throw error;

      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
      };
      setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  const clearAllNotifications = async () => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const incrementNotes = () => {
    setStats(prev => ({ ...prev, notesCreated: prev.notesCreated + 1 }));
  };

  const addStudyTime = (minutes: number) => {
    setStats(prev => ({
      ...prev,
      studyHours: Math.round((prev.studyHours * 60 + minutes) / 60 * 10) / 10,
    }));
  };

  const resetUserData = () => {
    setStats(getInitialStats());
    setTestHistory([]);
    setNotifications([]);
    setSubjectScores({});
  };

  // AI tips based on performance
  const getAiTips = (): string[] => {
    const tips: string[] = [];

    if (stats.testsCompleted === 0) {
      tips.push('Start with a practice test to track your progress!');
      tips.push('Create your first smart note to organize your studies');
      tips.push('Set a daily study goal to stay consistent');
    } else {
      const subjects = Object.values(subjectScores);
      if (subjects.length > 0) {
        const weakest = subjects.reduce((a, b) => (a.avgScore < b.avgScore ? a : b));
        const strongest = subjects.reduce((a, b) => (a.avgScore > b.avgScore ? a : b));

        if (weakest.avgScore < 70) {
          tips.push(`Focus more on ${weakest.subject} - your average is ${weakest.avgScore}%`);
        }
        if (strongest.avgScore >= 80) {
          tips.push(`Great progress in ${strongest.subject}! Keep it up! 🌟`);
        }
      }

      if (stats.avgScore < 60) {
        tips.push('Try reviewing concepts before taking tests');
      } else if (stats.avgScore >= 80) {
        tips.push('Excellent performance! Challenge yourself with harder tests');
      }

      tips.push('Take breaks every 45 minutes for better retention');
    }

    return tips.slice(0, 3);
  };

  return (
    <DataContext.Provider
      value={{
        stats,
        testHistory,
        notifications,
        subjectScores,
        weeklyData,
        addTestResult,
        addNotification,
        markNotificationRead,
        clearAllNotifications,
        incrementNotes,
        addStudyTime,
        resetUserData,
        getAiTips,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
