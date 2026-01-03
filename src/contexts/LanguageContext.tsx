import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// All supported languages
export const languages = [
  { code: 'en', name: 'English', native: 'English', region: 'International' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'North India' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'Andhra Pradesh, Telangana' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'Kerala' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', region: 'Maharashtra' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', region: 'West Bengal' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', region: 'Assam' },
  { code: 'ur', name: 'Urdu', native: 'اردو', region: 'Multiple States' },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर', region: 'Jammu & Kashmir' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', region: 'Multiple States' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', region: 'Sikkim, West Bengal' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी', region: 'Goa' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', region: 'Bihar' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', region: 'Jharkhand' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', region: 'Jammu' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্', region: 'Manipur' },
  { code: 'bo', name: 'Bodo', native: 'बड़ो', region: 'Assam' },
];

interface LanguageContextType {
  language: string;
  languageData: typeof languages[0] | undefined;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations (can be expanded)
const translations: Record<string, Record<string, string>> = {
  en: {
    'home': 'Home',
    'dashboard': 'Dashboard',
    'tests': 'Tests',
    'ai_tutor': 'AI Tutor',
    'analytics': 'Analytics',
    'profile': 'Profile',
    'settings': 'Settings',
    'notifications': 'Notifications',
    'logout': 'Logout',
    'login': 'Login',
    'signup': 'Sign Up',
    'welcome': 'Welcome',
    'continue': 'Continue',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'back': 'Back',
    'next': 'Next',
    'search': 'Search',
    'loading': 'Loading...',
  },
  hi: {
    'home': 'होम',
    'dashboard': 'डैशबोर्ड',
    'tests': 'परीक्षाएं',
    'ai_tutor': 'AI ट्यूटर',
    'analytics': 'विश्लेषण',
    'profile': 'प्रोफ़ाइल',
    'settings': 'सेटिंग्स',
    'notifications': 'सूचनाएं',
    'logout': 'लॉगआउट',
    'login': 'लॉगिन',
    'signup': 'साइन अप',
    'welcome': 'स्वागत है',
    'continue': 'जारी रखें',
    'submit': 'जमा करें',
    'cancel': 'रद्द करें',
    'save': 'सेव करें',
    'delete': 'हटाएं',
    'edit': 'संपादित करें',
    'back': 'वापस',
    'next': 'अगला',
    'search': 'खोजें',
    'loading': 'लोड हो रहा है...',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => {
    const saved = localStorage.getItem('motimate_language');
    return saved || 'en';
  });

  const languageData = languages.find(l => l.code === language);

  useEffect(() => {
    localStorage.setItem('motimate_language', language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (code: string) => {
    setLanguageState(code);
  };

  // Translation function
  const t = (key: string): string => {
    const langTranslations = translations[language] || translations['en'];
    return langTranslations[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, languageData, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
