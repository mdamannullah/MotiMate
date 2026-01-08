import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { MotiCard } from '@/components/ui/MotiCard';
import { MotiButton } from '@/components/ui/MotiButton';
import { useData } from '@/contexts/DataContext';
import { Mic, Globe, Volume2, Copy, Check, Languages, Save, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

const languages = [
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' }, { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' }, { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' }, { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' }, { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
];

// Simple mock translation (in production, use a real translation API)
const translateToEnglish = async (text: string, sourceLang: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `[Translated from ${sourceLang}]: ${text}`;
};

export default function LiveTranslateScreen() {
  const { addNotification, incrementNotes } = useData();
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isListening, transcript, error: speechError, startListening, stopListening, isSupported } = useSpeechRecognition();

  useEffect(() => { if (transcript) setOriginalText(prev => prev + (prev ? ' ' : '') + transcript); }, [transcript]);
  useEffect(() => { if (speechError) toast.error(speechError); }, [speechError]);

  const handleStartRecording = () => { if (!isSupported) { toast.error('Speech recognition is not supported in your browser.'); return; } setOriginalText(''); setTranslatedText(''); startListening(); toast.info('Listening... Speak in your selected language'); };
  const handleStopRecording = async () => { stopListening(); if (originalText) { setIsProcessing(true); try { const langName = languages.find(l => l.code === selectedLang)?.name || 'Unknown'; const translated = await translateToEnglish(originalText, langName); setTranslatedText(translated); toast.success('Translation complete!'); } catch { toast.error('Translation failed.'); } finally { setIsProcessing(false); } } };
  const handleCopy = () => { if (!translatedText) return; navigator.clipboard.writeText(translatedText); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000); };
  const handleSaveAsNote = () => { if (!translatedText) return; incrementNotes(); addNotification({ title: 'Note Saved', message: 'Your translation has been saved to notes!', type: 'achievement' }); toast.success('Translation saved as note! 📝'); };
  const handleSpeak = (text: string, lang: string = 'en-US') => { if (!text) return; const utterance = new SpeechSynthesisUtterance(text); utterance.lang = lang; window.speechSynthesis.speak(utterance); toast.info('Playing audio...'); };

  return (
    <AppLayout>
      <div className="px-4 py-4 lg:px-8 space-y-6 pb-24 lg:pb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-bold mb-2">Live Translation</h1><p className="text-muted-foreground">Translate lectures in real-time using voice</p></motion.div>
        <MotiCard delay={0.1}><div className="flex items-center gap-3 mb-4"><Languages size={20} className="text-primary" /><h3 className="font-semibold">Source Language</h3></div><div className="grid grid-cols-4 gap-2">{languages.map((lang) => (<button key={lang.code} onClick={() => setSelectedLang(lang.code)} disabled={isListening} className={`p-2 rounded-xl text-center transition-all ${selectedLang === lang.code ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'} ${isListening ? 'opacity-50 cursor-not-allowed' : ''}`}><p className="text-xs font-medium">{lang.name}</p><p className="text-xs opacity-70">{lang.native}</p></button>))}</div></MotiCard>
        <MotiCard delay={0.2} className="text-center py-8"><motion.button onClick={isListening ? handleStopRecording : handleStartRecording} disabled={isProcessing} className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${isListening ? 'bg-destructive' : 'bg-primary'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`} animate={isListening ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}>{isListening ? <StopCircle size={36} className="text-white" /> : <Mic size={36} className="text-white" />}</motion.button><p className="text-muted-foreground">{isProcessing ? 'Processing translation...' : isListening ? 'Tap to stop and translate...' : 'Tap to start speaking'}</p>{isListening && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-1 mt-4">{[0, 1, 2, 3, 4].map((i) => (<motion.div key={i} className="w-1 bg-primary rounded-full" animate={{ height: [8, 24, 8] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} />))}</motion.div>)}{!isSupported && (<p className="text-sm text-destructive mt-4">Voice recognition is not supported in your browser.</p>)}</MotiCard>
        {(isListening || originalText) && (<MotiCard delay={0.25}><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Mic size={18} className="text-primary" /><h3 className="font-semibold">Live Transcript</h3>{isListening && (<span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"><span className="w-2 h-2 bg-primary rounded-full animate-pulse" />Recording</span>)}</div><button onClick={() => handleSpeak(originalText, selectedLang)} className="p-2 hover:bg-muted rounded-lg" disabled={!originalText}><Volume2 size={18} className="text-muted-foreground" /></button></div><p className="text-muted-foreground leading-relaxed min-h-[60px]">{originalText || (isListening ? 'Listening...' : 'No speech detected')}</p></MotiCard>)}
        {originalText && !isListening && (<MotiCard delay={0.3}><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Globe size={18} className="text-primary" /><h3 className="font-semibold">Original ({languages.find(l => l.code === selectedLang)?.name})</h3></div><button onClick={() => handleSpeak(originalText, selectedLang)} className="p-2 hover:bg-muted rounded-lg"><Volume2 size={18} className="text-muted-foreground" /></button></div><p className="text-muted-foreground leading-relaxed">{originalText}</p></MotiCard>)}
        {translatedText && (<MotiCard delay={0.4}><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Languages size={18} className="text-success" /><h3 className="font-semibold text-success">English Translation</h3></div><div className="flex gap-1"><button onClick={() => handleSpeak(translatedText, 'en-US')} className="p-2 hover:bg-muted rounded-lg"><Volume2 size={18} className="text-muted-foreground" /></button><button onClick={handleCopy} className="p-2 hover:bg-muted rounded-lg">{copied ? <Check size={18} className="text-success" /> : <Copy size={18} className="text-muted-foreground" />}</button></div></div><p className="text-foreground leading-relaxed">{translatedText}</p></MotiCard>)}
        {translatedText && (<MotiButton size="full" onClick={handleSaveAsNote}><Save size={18} /> Save as Notes</MotiButton>)}
      </div>
    </AppLayout>
  );
}
