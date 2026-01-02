import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { MotiCard } from '@/components/ui/MotiCard';
import { MotiButton } from '@/components/ui/MotiButton';
import { Mic, MicOff, Globe, Volume2, Copy, Check, Languages } from 'lucide-react';
import { toast } from 'sonner';

const languages = [
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
];

export default function LiveTranslateScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ta');
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    toast.info('Listening... Speak in your regional language');
    
    // Simulate recording for demo
    setTimeout(() => {
      setOriginalText('இன்று நாம் ஒளிச்சேர்க்கை பற்றி படிப்போம். இது தாவரங்கள் சூரிய ஒளியை உணவாக மாற்றும் செயல்முறை.');
      setTranslatedText("Today we will study about photosynthesis. This is the process by which plants convert sunlight into food.");
      setIsRecording(false);
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="px-4 py-4 lg:px-8 space-y-6 pb-24 lg:pb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-2">Live Translation</h1>
          <p className="text-muted-foreground">Translate lectures in real-time</p>
        </motion.div>

        {/* Language Selection */}
        <MotiCard delay={0.1}>
          <div className="flex items-center gap-3 mb-4">
            <Languages size={20} className="text-primary" />
            <h3 className="font-semibold">Source Language</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`p-2 rounded-xl text-center transition-colors ${
                  selectedLang === lang.code
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <p className="text-xs font-medium">{lang.name}</p>
                <p className="text-xs opacity-70">{lang.native}</p>
              </button>
            ))}
          </div>
        </MotiCard>

        {/* Recording Section */}
        <MotiCard delay={0.2} className="text-center py-8">
          <motion.button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
              isRecording ? 'bg-destructive' : 'bg-primary'
            }`}
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
          >
            {isRecording ? (
              <MicOff size={36} className="text-white" />
            ) : (
              <Mic size={36} className="text-white" />
            )}
          </motion.button>
          <p className="text-muted-foreground">
            {isRecording ? 'Tap to stop recording...' : 'Tap to start translation'}
          </p>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-1 mt-4"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{ height: [8, 24, 8] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          )}
        </MotiCard>

        {/* Original Text */}
        {originalText && (
          <MotiCard delay={0.3}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-primary" />
                <h3 className="font-semibold">Original</h3>
              </div>
              <button className="p-2 hover:bg-muted rounded-lg">
                <Volume2 size={18} className="text-muted-foreground" />
              </button>
            </div>
            <p className="text-muted-foreground leading-relaxed">{originalText}</p>
          </MotiCard>
        )}

        {/* Translated Text */}
        {translatedText && (
          <MotiCard delay={0.4}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Languages size={18} className="text-success" />
                <h3 className="font-semibold text-success">English Translation</h3>
              </div>
              <button onClick={handleCopy} className="p-2 hover:bg-muted rounded-lg">
                {copied ? (
                  <Check size={18} className="text-success" />
                ) : (
                  <Copy size={18} className="text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-foreground leading-relaxed">{translatedText}</p>
          </MotiCard>
        )}

        {translatedText && (
          <MotiButton size="full" onClick={() => toast.success('Notes saved!')}>
            Save as Notes
          </MotiButton>
        )}
      </div>
    </AppLayout>
  );
}
