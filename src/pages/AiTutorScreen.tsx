import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Send, Paperclip, Mic, MicOff, X, Image, FileText, Camera, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';

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

// Comprehensive AI response system
const aiKnowledgeBase: Record<string, string> = {
  'photosynthesis': `**Photosynthesis** is how plants make their food using sunlight.

**Formula:** 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂

**Key Points:**
• Happens in chloroplasts
• Chlorophyll captures light energy
• Produces glucose and oxygen
• Essential for life on Earth`,

  'newton': `**Newton's Laws of Motion**

**1st Law (Inertia):** Objects stay at rest or in motion unless acted upon by a force.

**2nd Law:** F = ma (Force = mass × acceleration)

**3rd Law:** Every action has an equal and opposite reaction.

*Example: When you push a wall, it pushes back with equal force.*`,

  'atomic': `**Atomic Structure**

**Components:**
• **Protons** (+) - in nucleus
• **Neutrons** (0) - in nucleus  
• **Electrons** (-) - orbit nucleus

**Key Numbers:**
• Atomic Number = Protons
• Mass Number = Protons + Neutrons

**Shell Capacity:** 2, 8, 18, 32...`,

  'quadratic': `**Quadratic Formula**

For ax² + bx + c = 0:

**x = (-b ± √(b² - 4ac)) / 2a**

**Discriminant (D = b² - 4ac):**
• D > 0 → Two real solutions
• D = 0 → One solution
• D < 0 → No real solutions`,

  'cell': `**Cell Structure**

**Prokaryotic** (bacteria): No nucleus, simple
**Eukaryotic** (plants/animals): Has nucleus, complex

**Key Organelles:**
• Nucleus - Control center
• Mitochondria - Energy production
• Ribosomes - Protein synthesis
• ER - Transport system`,

  'exam': `**Exam Preparation Tips**

**Study Techniques:**
• Use Pomodoro (25 min work, 5 min break)
• Practice past papers
• Teach concepts to others
• Use spaced repetition

**Before Exam:**
• Sleep 7-8 hours
• Eat healthy breakfast
• Arrive early, stay calm`,

  'derivative': `**Derivatives in Calculus**

**Power Rule:** d/dx(xⁿ) = n·xⁿ⁻¹

**Common Derivatives:**
• d/dx(x²) = 2x
• d/dx(sin x) = cos x
• d/dx(eˣ) = eˣ

**Product Rule:** (fg)' = f'g + fg'`,

  'periodic': `**Periodic Table**

**Groups (Columns):**
• Group 1 - Alkali Metals (reactive)
• Group 17 - Halogens
• Group 18 - Noble Gases (stable)

**Trends:**
• Left→Right: Size ↓, Electronegativity ↑
• Top→Bottom: Size ↑`,

  'integration': `**Integration Basics**

**Power Rule:** ∫xⁿ dx = xⁿ⁺¹/(n+1) + C

**Common Integrals:**
• ∫eˣ dx = eˣ + C
• ∫sin x dx = -cos x + C
• ∫1/x dx = ln|x| + C

*Always add constant C!*`,

  'water cycle': `**Water Cycle**

**4 Stages:**
1. **Evaporation** - Sun heats water → vapor
2. **Condensation** - Vapor cools → clouds
3. **Precipitation** - Rain, snow, hail
4. **Collection** - Water returns to oceans/lakes

*Cycle repeats continuously!*`,

  'machine learning': `**Machine Learning Basics**

**Types:**
• **Supervised Learning** - Labeled data (classification, regression)
• **Unsupervised Learning** - No labels (clustering, dimensionality reduction)
• **Reinforcement Learning** - Learn from rewards

**Key Algorithms:**
• Linear/Logistic Regression
• Decision Trees
• Neural Networks
• SVM, K-means`,

  'data structure': `**Data Structures**

**Linear:**
• Arrays - Fixed size, O(1) access
• Linked Lists - Dynamic, O(n) access
• Stacks - LIFO
• Queues - FIFO

**Non-Linear:**
• Trees - Hierarchical
• Graphs - Connected nodes
• Hash Tables - O(1) average lookup`,

  'algorithm': `**Algorithm Complexity**

**Big O Notation:**
• O(1) - Constant
• O(log n) - Logarithmic  
• O(n) - Linear
• O(n log n) - Linearithmic
• O(n²) - Quadratic

**Common Algorithms:**
• Binary Search - O(log n)
• QuickSort - O(n log n) avg
• BFS/DFS - O(V + E)`,
};

const getAiResponse = (query: string, hasMedia: boolean = false): string => {
  const q = query.toLowerCase();
  
  if (hasMedia) {
    const mediaResponse = "I can see the file you've shared. ";
    for (const [key, response] of Object.entries(aiKnowledgeBase)) {
      if (q.includes(key)) {
        return mediaResponse + "Based on your question:\n\n" + response;
      }
    }
    return mediaResponse + "I've analyzed this content. What specific questions do you have about it?";
  }
  
  for (const [key, response] of Object.entries(aiKnowledgeBase)) {
    if (q.includes(key)) {
      return response;
    }
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hi! I'm your AI study companion. I can help with Physics, Chemistry, Biology, Math, CS, and study tips. What would you like to learn?";
  }

  if (q.includes('thank')) {
    return "You're welcome! Feel free to ask anything else. Good luck with your studies!";
  }

  if (q.includes('formula')) {
    return "**Key Formulas:**\n\n**Physics:** F=ma, v=u+at, E=mc²\n**Chemistry:** PV=nRT, n=m/M\n**Math:** (a+b)²=a²+2ab+b²\n\nWhich subject do you need more formulas for?";
  }

  return "I'd be happy to help! Could you be more specific? I can explain:\n\n• Physics, Chemistry, Biology, Math topics\n• Data Structures & Algorithms\n• Machine Learning concepts\n• Problem solving techniques\n• Exam preparation tips\n\nJust ask about any topic!";
};

const suggestions = [
  "Explain photosynthesis",
  "Newton's laws of motion", 
  "How to solve quadratic equations",
  "Tips for exam preparation",
];

export default function AiTutorScreen() {
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
    const hadMedia = attachedMedia.length > 0;
    setInput('');
    setAttachedMedia([]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: getAiResponse(currentInput, hadMedia),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
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
            {isTyping && (
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
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Container */}
            <div className="relative flex items-end gap-2 bg-card border border-border rounded-2xl p-2">
              {/* Media Button */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl"
                  onClick={() => setShowMediaOptions(!showMediaOptions)}
                >
                  <Plus size={20} className="text-muted-foreground" />
                </Button>

                {/* Media Options Popup */}
                <AnimatePresence>
                  {showMediaOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-12 left-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileSelect(e, 'image')}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors w-full"
                      >
                        <Image size={18} className="text-primary" />
                        <span className="text-sm">Upload Image</span>
                      </button>
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf,.doc,.docx,.txt';
                          input.multiple = true;
                          input.onchange = (e) => handleFileSelect(e as any, 'document');
                          input.click();
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors w-full border-t border-border"
                      >
                        <FileText size={18} className="text-primary" />
                        <span className="text-sm">Upload Document</span>
                      </button>
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.capture = 'environment';
                          input.onchange = (e) => handleFileSelect(e as any, 'image');
                          input.click();
                          setShowMediaOptions(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors w-full border-t border-border"
                      >
                        <Camera size={18} className="text-primary" />
                        <span className="text-sm">Take Photo</span>
                      </button>
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
                className="flex-1 bg-transparent border-none resize-none text-sm placeholder:text-muted-foreground focus:outline-none py-2 px-2 max-h-32"
                rows={1}
              />

              {/* Voice Input Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-xl ${isListening ? 'bg-primary/20 text-primary' : ''}`}
                onClick={handleVoiceInput}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} className="text-muted-foreground" />}
              </Button>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!input.trim() && attachedMedia.length === 0}
                size="icon"
                className="h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40"
              >
                <Send size={16} />
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-2">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
