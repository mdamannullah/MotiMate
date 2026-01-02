import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { MotiCard } from '@/components/ui/MotiCard';
import { Check, Globe, Search } from 'lucide-react';
import { toast } from 'sonner';

// All Indian languages
const languages = [
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

export default function LanguageSettingsScreen() {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('motimate_language');
    if (saved) setSelectedLang(saved);
  }, []);

  const handleSelectLanguage = (code: string) => {
    setSelectedLang(code);
    localStorage.setItem('motimate_language', code);
    const lang = languages.find(l => l.code === code);
    toast.success(`Language changed to ${lang?.name}`);
    // In a real app, this would trigger i18n language change
  };

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native.includes(searchQuery) ||
      lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mobile-container min-h-screen pb-8">
      <AppHeader title="App Language" showBack />

      <main className="px-4 py-4 space-y-4">
        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="moti-input pl-12"
          />
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary/10 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Globe size={20} className="text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">App Language</p>
              <p className="text-xs text-muted-foreground">
                Changing the language will update all text in the app to the selected language.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Languages List */}
        <div className="space-y-2">
          {filteredLanguages.map((lang, index) => (
            <MotiCard
              key={lang.code}
              delay={index * 0.02}
              onClick={() => handleSelectLanguage(lang.code)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{lang.name}</p>
                    <p className="text-muted-foreground">{lang.native}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{lang.region}</p>
                </div>
                {selectedLang === lang.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check size={14} className="text-primary-foreground" />
                  </motion.div>
                )}
              </div>
            </MotiCard>
          ))}
        </div>
      </main>
    </div>
  );
}
