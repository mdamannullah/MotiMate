import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface UserStats {
  testsCompleted: number;
  notesCreated: number;
  studyHours: number;
  avgScore: number;
  totalScore: number;
}

export interface TestResult {
  id: string;
  subject: string;
  topic: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  timestamp: number;
}

export interface Notification {
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

// Local storage helpers
const getStorageKey = (userId: string | undefined, key: string) => 
  userId ? `motimate_${key}_${userId}` : null;

const loadFromStorage = <T,>(key: string | null, defaultValue: T): T => {
  if (!key) return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string | null, data: unknown) => {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(data));
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(getInitialStats);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subjectScores, setSubjectScores] = useState<Record<string, SubjectScore>>({});

  // Load data from localStorage when user changes
  const refreshData = useCallback(async () => {
    if (!user) {
      setStats(getInitialStats());
      setTestHistory([]);
      setNotifications([]);
      setSubjectScores({});
      return;
    }

    try {
      // Load test results
      const testResultsKey = getStorageKey(user.id, 'test_results');
      const storedResults = loadFromStorage<TestResult[]>(testResultsKey, []);
      setTestHistory(storedResults);

      // Load notifications
      const notificationsKey = getStorageKey(user.id, 'notifications');
      const storedNotifications = loadFromStorage<Notification[]>(notificationsKey, []);
      setNotifications(storedNotifications);

      // Load notes count
      const notesKey = getStorageKey(user.id, 'notes');
      const storedNotes = loadFromStorage<{ id: string }[]>(notesKey, []);
      const notesCount = storedNotes.length;

      // Calculate stats and subject scores
      let totalScore = 0;
      let totalTime = 0;
      const subjectMap: Record<string, SubjectScore> = {};

      storedResults.forEach(result => {
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

      // Load stats
      const statsKey = getStorageKey(user.id, 'stats');
      const storedStats = loadFromStorage<UserStats>(statsKey, getInitialStats());

      setStats({
        testsCompleted: storedResults.length,
        notesCreated: notesCount,
        studyHours: storedStats.studyHours || 0,
        avgScore: storedResults.length > 0 ? Math.round(totalScore / storedResults.length) : 0,
        totalScore
      });

    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Weekly data calculated from test history
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

  // Add test result
  const addTestResult = (result: Omit<TestResult, 'id' | 'timestamp'>) => {
    const newResult: TestResult = {
      ...result,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const updatedHistory = [newResult, ...testHistory];
    setTestHistory(updatedHistory);

    // Save to localStorage
    if (user) {
      const key = getStorageKey(user.id, 'test_results');
      saveToStorage(key, updatedHistory);
    }

    // Update stats
    setStats(prev => {
      const newTotalScore = prev.totalScore + result.percentage;
      const newTestsCompleted = prev.testsCompleted + 1;
      const newStats = {
        ...prev,
        testsCompleted: newTestsCompleted,
        totalScore: newTotalScore,
        avgScore: Math.round(newTotalScore / newTestsCompleted),
      };
      
      if (user) {
        const key = getStorageKey(user.id, 'stats');
        saveToStorage(key, newStats);
      }
      
      return newStats;
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

    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false,
    };
    
    const updatedNotifications = [newNotification, ...notifications].slice(0, 50);
    setNotifications(updatedNotifications);
    
    const key = getStorageKey(user.id, 'notifications');
    saveToStorage(key, updatedNotifications);
  };

  const markNotificationRead = async (id: string) => {
    if (!user) return;
    
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    
    const key = getStorageKey(user.id, 'notifications');
    saveToStorage(key, updatedNotifications);
  };

  const clearAllNotifications = async () => {
    if (!user) return;
    
    setNotifications([]);
    const key = getStorageKey(user.id, 'notifications');
    saveToStorage(key, []);
  };

  const incrementNotes = () => {
    setStats(prev => {
      const newStats = { ...prev, notesCreated: prev.notesCreated + 1 };
      if (user) {
        const key = getStorageKey(user.id, 'stats');
        saveToStorage(key, newStats);
      }
      return newStats;
    });
  };

  const addStudyTime = (minutes: number) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        studyHours: Math.round((prev.studyHours * 60 + minutes) / 60 * 10) / 10,
      };
      if (user) {
        const key = getStorageKey(user.id, 'stats');
        saveToStorage(key, newStats);
      }
      return newStats;
    });
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
