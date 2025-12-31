import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User stats aur data ka type
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
  type: 'login' | 'signup' | 'password_change' | 'test_completed' | 'achievement' | 'reminder';
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial empty stats for new users
const getInitialStats = (): UserStats => ({
  testsCompleted: 0,
  notesCreated: 0,
  studyHours: 0,
  avgScore: 0,
  totalScore: 0,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<UserStats>(getInitialStats);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subjectScores, setSubjectScores] = useState<Record<string, SubjectScore>>({});

  // LocalStorage se data load karo
  useEffect(() => {
    const savedStats = localStorage.getItem('motimate_stats');
    const savedHistory = localStorage.getItem('motimate_test_history');
    const savedNotifications = localStorage.getItem('motimate_notifications');
    const savedSubjectScores = localStorage.getItem('motimate_subject_scores');

    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedHistory) setTestHistory(JSON.parse(savedHistory));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedSubjectScores) setSubjectScores(JSON.parse(savedSubjectScores));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('motimate_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('motimate_test_history', JSON.stringify(testHistory));
  }, [testHistory]);

  useEffect(() => {
    localStorage.setItem('motimate_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('motimate_subject_scores', JSON.stringify(subjectScores));
  }, [subjectScores]);

  // Weekly data calculate karo from test history
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

  // Test result add karo
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

    // Add notification
    addNotification({
      type: 'test_completed',
      title: 'Test Completed! 🎉',
      message: `You scored ${result.percentage}% in ${result.subject} - ${result.topic}`,
    });
  };

  // Notification add karo
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Max 50 notifications
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
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
    localStorage.removeItem('motimate_stats');
    localStorage.removeItem('motimate_test_history');
    localStorage.removeItem('motimate_notifications');
    localStorage.removeItem('motimate_subject_scores');
  };

  // AI tips based on performance
  const getAiTips = (): string[] => {
    const tips: string[] = [];

    if (stats.testsCompleted === 0) {
      tips.push('Start with a practice test to track your progress!');
      tips.push('Create your first smart note to organize your studies');
      tips.push('Set a daily study goal to stay consistent');
    } else {
      // Find weakest subject
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
