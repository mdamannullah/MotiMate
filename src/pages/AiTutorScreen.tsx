import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Send, Paperclip, Mic, MicOff, X, Image, FileText, Camera, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

const AI_TUTOR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;

export default function AiTutorScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<MediaFile[]>([]);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
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

  // Fetch user profile for context
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) setUserProfile(data);
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // Update input when speech transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    }
  }, [transcript]);

  // Show speech error
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

  const streamChat = async (userMessage: string) => {
    const newChatHistory = [...chatHistory, { role: 'user' as const, content: userMessage }];
    setChatHistory(newChatHistory);

    const resp = await fetch(AI_TUTOR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: newChatHistory,
        userProfile 
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${resp.status}`);
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            // Update the last assistant message
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.type === "bot") {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: assistantContent } : m));
              }
              return [...prev, { 
                id: Date.now().toString(), 
                type: "bot", 
                text: assistantContent,
                timestamp: new Date()
              }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.type === "bot") {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: assistantContent } : m));
              }
              return [...prev, { 
                id: Date.now().toString(), 
                type: "bot", 
                text: assistantContent,
                timestamp: new Date()
              }];
            });
          }
        } catch { /* ignore partial leftovers */ }
      }
    }

    // Update chat history with assistant response
    setChatHistory(prev => [...prev, { role: 'assistant' as const, content: assistantContent }]);

    // Save to database
    if (user && assistantContent) {
      await supabase.from('chat_history').insert({
        user_id: user.id,
        message: userMessage,
        response: assistantContent,
        subject: userProfile?.subjects?.[0] || null
      });
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

    try {
      await streamChat(currentInput);
    } catch (error) {
      console.error('AI Tutor error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get response');
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
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
        {/* Minimal Header */}
        <header className="flex items-center justify-center py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <Sparkles size={16} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">MotiMate AI</span>
          </div>
        </header>

        {/* Chat Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="max-w-2xl mx-auto py-6 space-y-6">
            {/* Empty State with Suggestions */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4">
                  <Sparkles size={28} className="text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">How can I help you study?</h2>
                <p className="text-muted-foreground text-sm mb-8 max-w-sm">
                  Ask questions, upload study materials, or use voice input.
                </p>
                
                <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                  {suggestions.map((suggestion, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleSuggestion(suggestion)}
                      className="p-3 text-sm text-left rounded-xl border border-border hover:border-primary hover:bg-card transition-all"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] lg:max-w-[70%] ${message.type === 'user' ? 'order-2' : ''}`}>
                    {/* Media Preview */}
                    {message.media && message.media.length > 0 && (
                      <div className={`flex flex-wrap gap-2 mb-2 ${message.type === 'user' ? 'justify-end' : ''}`}>
                        {message.media.map(m => (
                          <div key={m.id} className="relative">
                            {m.type === 'image' ? (
                              <img 
                                src={m.url} 
                                alt={m.name}
                                className="max-w-[200px] max-h-[150px] rounded-lg object-cover"
                              />
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
                    
                    {/* Message Text */}
                    {message.text && (
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-card border border-border rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && messages[messages.length - 1]?.type !== 'bot' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border bg-background p-4 pb-20 lg:pb-4">
          <div className="max-w-2xl mx-auto">
            {/* Listening Indicator */}
            {isListening && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-3 p-3 bg-primary/10 rounded-xl"
              >
                <motion.div
                  className="w-3 h-3 rounded-full bg-primary"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm text-primary font-medium">Listening...</span>
                <span className="text-sm text-muted-foreground flex-1">{transcript || 'Speak now'}</span>
              </motion.div>
            )}

            {/* Attached Media Preview */}
            {attachedMedia.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {attachedMedia.map(m => (
                  <div key={m.id} className="relative group">
                    {m.type === 'image' ? (
                      <img 
                        src={m.url} 
                        alt={m.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                        <FileText size={14} />
                        <span className="text-xs truncate max-w-[80px]">{m.name}</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeMedia(m.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Container */}
            <div className="flex items-end gap-2 bg-card border border-border rounded-2xl p-2">
              {/* Media Button */}
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-xl shrink-0"
                  onClick={() => setShowMediaOptions(!showMediaOptions)}
                >
                  <Plus size={18} />
                </Button>
                
                {/* Media Options Popup */}
                <AnimatePresence>
                  {showMediaOptions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl p-2 shadow-lg"
                    >
                      <div className="flex gap-1">
                        <label className="p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                          <Image size={18} />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e, 'image')}
                          />
                        </label>
                        <label className="p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                          <FileText size={18} />
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e, 'document')}
                          />
                        </label>
                        <label className="p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                          <Camera size={18} />
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e, 'image')}
                          />
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground min-h-[36px] max-h-[120px] py-2"
                rows={1}
              />

              {/* Voice Button */}
              <Button
                size="icon"
                variant="ghost"
                className={`h-9 w-9 rounded-xl shrink-0 ${isListening ? 'bg-primary/20 text-primary' : ''}`}
                onClick={handleVoiceInput}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>

              {/* Send Button */}
              <Button
                size="icon"
                className="h-9 w-9 rounded-xl shrink-0"
                onClick={handleSend}
                disabled={(!input.trim() && attachedMedia.length === 0) || isTyping}
              >
                <Send size={16} />
              </Button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'image')}
              accept="image/*"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
