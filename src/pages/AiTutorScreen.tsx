import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Send, Mic, Sparkles, Book, HelpCircle, Lightbulb } from 'lucide-react';
import aiTutorAvatar from '@/assets/ai-tutor-avatar.png';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

// Suggested questions
const suggestions = [
  { icon: HelpCircle, text: 'Explain photosynthesis' },
  { icon: Lightbulb, text: 'Tips for exam preparation' },
  { icon: Book, text: 'Summarize Newton\'s laws' },
];

export default function AiTutorScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hello! I\'m your AI study buddy. Ask me anything about your studies, I can help with explanations, notes, and even quiz you! 📚',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response - production mein actual API call hogi
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: getAiResponse(input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Demo AI responses
  const getAiResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('photosynthesis')) {
      return 'Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. The formula is: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂ 🌱';
    }
    if (q.includes('newton')) {
      return 'Newton\'s three laws of motion:\n\n1️⃣ An object stays at rest or moves uniformly unless acted upon by a force.\n\n2️⃣ F = ma (Force equals mass times acceleration)\n\n3️⃣ Every action has an equal and opposite reaction.';
    }
    if (q.includes('exam') || q.includes('tips')) {
      return 'Here are my top study tips:\n\n📌 Create a study schedule\n📌 Take breaks every 45 mins\n📌 Practice with past papers\n📌 Teach concepts to others\n📌 Get enough sleep before exams!';
    }
    
    return 'That\'s a great question! Let me help you understand this topic better. Could you provide more details about what specific aspect you\'d like me to explain? 🤔';
  };

  // Handle suggestion click
  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="mobile-container min-h-screen flex flex-col">
      <AppHeader title="AI Tutor" showBack />

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-36">
        {/* AI Avatar intro */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-4"
        >
          <motion.img
            src={aiTutorAvatar}
            alt="AI Tutor"
            className="w-24 h-24 object-contain mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h3 className="font-bold">MotiMate AI</h3>
          <p className="text-sm text-muted-foreground">Your personal study companion</p>
        </motion.div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 justify-center mb-4"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestion(suggestion.text)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border text-sm"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <suggestion.icon size={14} className="text-primary" />
                {suggestion.text}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <img
                  src={aiTutorAvatar}
                  alt="AI"
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
              )}
              <div
                className={message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
              >
                <p className="whitespace-pre-line text-sm">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <img
              src={aiTutorAvatar}
              alt="AI"
              className="w-8 h-8 rounded-full"
            />
            <div className="chat-bubble-bot flex gap-1 py-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-muted-foreground"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 pb-4 bg-gradient-to-t from-background via-background to-transparent pt-4">
        <div className="flex items-center gap-2 bg-card rounded-2xl p-2 shadow-card">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Mic size={20} className="text-muted-foreground" />
          </button>
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent outline-none text-sm py-2"
          />
          <motion.button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            whileTap={{ scale: 0.9 }}
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
