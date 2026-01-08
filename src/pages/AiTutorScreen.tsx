import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Send, Paperclip, Mic, MicOff, X, Image, FileText, Camera, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { generateAiResponse } from '@/services/mockData';

interface MediaFile {
  id: string;
  type: 'image' | 'document' | 'audio';
  url: string;
  name: string;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  media?: MediaFile[];
  timestamp: Date;
}

const suggestions = [
  "Explain photosynthesis",
  "Newton's laws of motion", 
  "How to solve quadratic equations",
  "Tips for exam preparation",
];

export default function AiTutorScreen() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<MediaFile[]>([]);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { 
    isListening, 
    transcript, 
    error: speechError, 
    startListening, 
    stopListening, 
    isSupported: speechSupported 
  } = useSpeechRecognition();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  useEffect(() => {
    if (transcript) {
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (speechError) {
      toast.error(speechError);
    }
  }, [speechError]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setAttachedMedia(prev => [...prev, {
            id: Date.now().toString() + Math.random(),
            type,
            url: reader.result as string,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
    setShowMediaOptions(false);
  };

  const removeMedia = (id: string) => {
    setAttachedMedia(prev => prev.filter(m => m.id !== id));
  };

  const handleVoiceInput = () => {
    if (!speechSupported) {
      toast.error('Voice input is not supported in your browser. Try Chrome or Edge.');
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
      toast.info('Listening... Speak now');
    }
  };

  const handleSend = async () => {
    if (!input.trim() && attachedMedia.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      media: attachedMedia.length > 0 ? [...attachedMedia] : undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setAttachedMedia([]);
    setIsTyping(true);

    // Simulate AI response with delay
    setTimeout(() => {
      const response = generateAiResponse(currentInput, profile || undefined);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        text: response,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen lg:h-[calc(100vh-2rem)]">
        <header className="flex items-center justify-center py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <Sparkles size={16} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">MotiMate AI</span>
          </div>
        </header>

        <ScrollArea className="flex-1 px-4">
          <div className="max-w-2xl mx-auto py-6 space-y-6">
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4">
                  <Sparkles size={28} className="text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">How can I help you study?</h2>
                <p className="text-muted-foreground text-sm mb-8 max-w-sm">Ask questions, upload study materials, or use voice input.</p>
                <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                  {suggestions.map((suggestion, i) => (
                    <motion.button key={i} onClick={() => handleSuggestion(suggestion)} className="p-3 text-sm text-left rounded-xl border border-border hover:border-primary hover:bg-card transition-all" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] lg:max-w-[70%] ${message.type === 'user' ? 'order-2' : ''}`}>
                    {message.media && message.media.length > 0 && (
                      <div className={`flex flex-wrap gap-2 mb-2 ${message.type === 'user' ? 'justify-end' : ''}`}>
                        {message.media.map(m => (
                          <div key={m.id} className="relative">
                            {m.type === 'image' ? (
                              <img src={m.url} alt={m.name} className="max-w-[200px] max-h-[150px] rounded-lg object-cover" />
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                                <FileText size={16} />
                                <span className="text-xs truncate max-w-[100px]">{m.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {message.text && (
                      <div className={`px-4 py-3 rounded-2xl ${message.type === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-card border border-border rounded-bl-md'}`}>
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-background p-4 pb-20 lg:pb-4">
          <div className="max-w-2xl mx-auto">
            {isListening && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-3 p-3 bg-primary/10 rounded-xl">
                <motion.div className="w-3 h-3 rounded-full bg-primary" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                <span className="text-sm text-primary font-medium">Listening...</span>
                <span className="text-sm text-muted-foreground flex-1">{transcript || 'Speak now'}</span>
              </motion.div>
            )}

            {attachedMedia.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {attachedMedia.map(m => (
                  <div key={m.id} className="relative group">
                    {m.type === 'image' ? (
                      <img src={m.url} alt={m.name} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                        <FileText size={14} />
                        <span className="text-xs truncate max-w-[80px]">{m.name}</span>
                      </div>
                    )}
                    <button onClick={() => removeMedia(m.id)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2 bg-card border border-border rounded-2xl p-2">
              <div className="relative">
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl shrink-0" onClick={() => setShowMediaOptions(!showMediaOptions)}>
                  <Plus size={18} />
                </Button>
                <AnimatePresence>
                  {showMediaOptions && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl shadow-lg p-2 min-w-[140px]">
                      <label className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                        <Image size={16} className="text-primary" />
                        <span className="text-sm">Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'image')} ref={fileInputRef} />
                      </label>
                      <label className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                        <FileText size={16} className="text-primary" />
                        <span className="text-sm">Document</span>
                        <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => handleFileSelect(e, 'document')} />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask anything..." className="flex-1 bg-transparent border-none resize-none text-sm py-2 px-1 focus:outline-none min-h-[36px] max-h-[120px]" rows={1} />

              <Button size="icon" variant="ghost" className={`h-9 w-9 rounded-xl shrink-0 ${isListening ? 'text-destructive bg-destructive/10' : ''}`} onClick={handleVoiceInput}>
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
              <Button size="icon" className="h-9 w-9 rounded-xl shrink-0" onClick={handleSend} disabled={!input.trim() && attachedMedia.length === 0}>
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
