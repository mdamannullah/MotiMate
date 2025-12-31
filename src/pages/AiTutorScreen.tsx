import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Send, Mic, Sparkles, Book, HelpCircle, Lightbulb, Calculator, Atom, Leaf, Globe } from 'lucide-react';
import aiTutorAvatar from '@/assets/ai-tutor-avatar.png';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

// More suggestion categories
const suggestionCategories = [
  { icon: Atom, text: 'Explain atomic structure', category: 'Chemistry' },
  { icon: Calculator, text: 'Solve quadratic equations', category: 'Math' },
  { icon: HelpCircle, text: 'What is photosynthesis?', category: 'Biology' },
  { icon: Lightbulb, text: 'Tips for exam preparation', category: 'Study' },
  { icon: Book, text: "Summarize Newton's laws", category: 'Physics' },
  { icon: Globe, text: 'Explain the water cycle', category: 'Geography' },
];

// Comprehensive AI response system
const aiKnowledgeBase: Record<string, string> = {
  // Physics
  'photosynthesis': `🌱 **Photosynthesis** is how plants make their food!

**Simple Explanation:**
Plants take in sunlight, water (H₂O), and carbon dioxide (CO₂) and convert them into glucose (sugar) and oxygen.

**The Formula:**
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂

**Key Points:**
• Happens in chloroplasts (containing chlorophyll)
• Chlorophyll gives plants their green color
• Oxygen is released as a byproduct
• Glucose is used for energy and growth

**Fun Fact:** One large tree can provide enough oxygen for 4 people per day! 🌳`,

  'newton': `⚡ **Newton's Three Laws of Motion**

**1️⃣ First Law (Law of Inertia):**
"An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force."
*Example: A ball won't move unless you kick it!*

**2️⃣ Second Law (F = ma):**
"Force equals mass times acceleration."
*Example: Pushing an empty cart is easier than a full one!*

**3️⃣ Third Law (Action-Reaction):**
"For every action, there is an equal and opposite reaction."
*Example: When you jump, you push Earth down, and Earth pushes you up!*

**Pro Tip:** Remember "IFA" - Inertia, Force=ma, Action-Reaction! 🚀`,

  'atomic': `⚛️ **Atomic Structure Explained**

**The Atom consists of:**

**1. Nucleus (Center)**
• Protons (+ve charge) - determines element type
• Neutrons (no charge) - adds mass

**2. Electron Cloud (Outside)**
• Electrons (-ve charge) - orbit the nucleus
• Arranged in shells/energy levels

**Key Numbers:**
• Atomic Number = Number of Protons
• Mass Number = Protons + Neutrons
• Neutral atom: Protons = Electrons

**Shell Capacity:** 2n² (where n = shell number)
• 1st shell: 2 electrons
• 2nd shell: 8 electrons
• 3rd shell: 18 electrons

**Remember:** "PEN" - Protons, Electrons, Neutrons! 📝`,

  'quadratic': `📐 **Solving Quadratic Equations**

**Standard Form:** ax² + bx + c = 0

**The Quadratic Formula:**
x = (-b ± √(b² - 4ac)) / 2a

**Step-by-Step:**
1. Identify a, b, and c from your equation
2. Calculate the discriminant: D = b² - 4ac
3. Plug values into the formula
4. Solve for both + and - cases

**Discriminant tells you:**
• D > 0 → Two real solutions
• D = 0 → One real solution
• D < 0 → No real solutions (complex)

**Example:** x² - 5x + 6 = 0
a=1, b=-5, c=6
x = (5 ± √(25-24))/2 = (5 ± 1)/2
x = 3 or x = 2 ✓`,

  'water cycle': `💧 **The Water Cycle (Hydrological Cycle)**

**Four Main Stages:**

**1. Evaporation ☀️**
• Sun heats water in oceans, lakes, rivers
• Water turns from liquid to vapor
• Rises into the atmosphere

**2. Condensation ☁️**
• Water vapor cools in atmosphere
• Forms tiny droplets around dust particles
• Creates clouds and fog

**3. Precipitation 🌧️**
• Droplets combine and get heavy
• Fall as rain, snow, sleet, or hail
• Returns water to Earth's surface

**4. Collection 🌊**
• Water collects in oceans, lakes, rivers
• Some seeps into groundwater
• Cycle repeats!

**Fun Fact:** The water you drink today could be millions of years old! 🌍`,

  'cell': `🔬 **Cell Structure - The Building Block of Life**

**Two Types of Cells:**

**1. Prokaryotic** (Bacteria)
• No nucleus
• Simple structure
• Smaller size

**2. Eukaryotic** (Plants, Animals, Fungi)
• Has nucleus
• Complex organelles
• Larger size

**Key Organelles:**
• **Nucleus** 🧠 - Control center, contains DNA
• **Mitochondria** ⚡ - Powerhouse, produces ATP
• **Ribosomes** 🏭 - Protein factories
• **Endoplasmic Reticulum** - Transport system
• **Golgi Body** 📦 - Packaging and shipping
• **Cell Membrane** 🛡️ - Protective boundary

**Plant cells also have:**
• Cell Wall - Extra protection
• Chloroplasts - For photosynthesis
• Large Vacuole - Storage`,

  'exam': `📚 **Ultimate Exam Preparation Tips**

**Before the Exam:**
✅ Create a study schedule (start 2 weeks early)
✅ Break topics into small chunks
✅ Use active recall - test yourself!
✅ Make flashcards for key concepts
✅ Teach concepts to someone else

**Study Techniques:**
📌 **Pomodoro Method:** 25 min study + 5 min break
📌 **Spaced Repetition:** Review at increasing intervals
📌 **Mind Maps:** Visual connections between topics
📌 **Past Papers:** Practice with real exam questions

**Night Before:**
• Light revision only - no new topics
• Pack your bag
• Get 7-8 hours of sleep 😴

**Exam Day:**
• Eat a healthy breakfast
• Arrive early
• Read all questions first
• Start with easy questions

**Remember:** Confidence is key! You've prepared well! 💪`,

  'periodic': `🧪 **Periodic Table Overview**

**Organization:**
• **Periods** (Rows): 7 horizontal rows
• **Groups** (Columns): 18 vertical columns

**Key Groups:**
• **Group 1** - Alkali Metals (Li, Na, K...) - Very reactive
• **Group 2** - Alkaline Earth Metals (Mg, Ca...)
• **Group 17** - Halogens (F, Cl, Br...) - Reactive non-metals
• **Group 18** - Noble Gases (He, Ne, Ar...) - Unreactive

**Trends:**
→ Across a period (left to right):
  • Atomic size decreases
  • Electronegativity increases

↓ Down a group (top to bottom):
  • Atomic size increases
  • Reactivity varies

**Mnemonic for first 20:**
"H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca"
*"Happy Henry Likes Beer But Could Not Obtain Food Naturally..."*`,

  'derivative': `📈 **Derivatives in Calculus**

**What is a Derivative?**
The rate of change of a function - basically, how fast something is changing!

**Basic Rules:**

**1. Power Rule:**
d/dx(xⁿ) = n·xⁿ⁻¹

**2. Constant Rule:**
d/dx(c) = 0

**3. Sum Rule:**
d/dx(f + g) = f' + g'

**4. Product Rule:**
d/dx(f·g) = f'g + fg'

**5. Quotient Rule:**
d/dx(f/g) = (f'g - fg')/g²

**Common Derivatives:**
• d/dx(x²) = 2x
• d/dx(x³) = 3x²
• d/dx(sin x) = cos x
• d/dx(eˣ) = eˣ

**Remember:** Derivatives = Slopes of tangent lines! 📐`,

  'hindi': `मैं हिंदी में भी मदद कर सकता हूं! 🙏

यहां कुछ उपयोगी study tips हैं:

1. **नियमित अध्ययन** - रोज़ 2-3 घंटे पढ़ाई करें
2. **Notes बनाएं** - अपने शब्दों में लिखें
3. **Revision** - हर हफ्ते पुराने topics दोहराएं
4. **Questions Practice** - Previous year papers solve करें

किसी भी subject में help चाहिए तो पूछें! 📚`,

  'tamil': `நான் தமிழிலும் உதவ முடியும்! 🙏

படிப்பதற்கான சில tips:
• தினமும் 2-3 மணி நேரம் படியுங்கள்
• குறிப்புகள் எழுதுங்கள்
• வாராந்திர revision செய்யுங்கள்

எந்த subject-லும் doubt இருந்தால் கேளுங்கள்! 📚`,
};

// Function to get AI response based on query
const getAiResponse = (query: string): string => {
  const q = query.toLowerCase();
  
  // Check for specific topics
  for (const [key, response] of Object.entries(aiKnowledgeBase)) {
    if (q.includes(key)) {
      return response;
    }
  }

  // General patterns
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hello! 👋 I'm your AI study buddy. I can help you with:\n\n📚 **Subjects:** Physics, Chemistry, Biology, Math\n💡 **Study Tips:** Exam prep, time management\n🌐 **Languages:** English, Hindi, Tamil\n\nWhat would you like to learn today?";
  }

  if (q.includes('thank')) {
    return "You're welcome! 😊 Happy to help! Keep studying and feel free to ask me anything else. Good luck with your exams! 🌟";
  }

  if (q.includes('what') && q.includes('you')) {
    return "I'm MotiMate AI - your personal study companion! 🤖\n\nI can help you with:\n• Explaining difficult concepts\n• Solving math problems\n• Exam preparation tips\n• Regional language support (Hindi, Tamil)\n• Creating study notes\n\nJust ask me anything about your studies!";
  }

  if (q.includes('calculus') || q.includes('integrate') || q.includes('integral')) {
    return "📐 **Integration Basics**\n\n**What is Integration?**\nThe reverse of differentiation - finding the area under a curve!\n\n**Basic Rules:**\n• ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n• ∫eˣ dx = eˣ + C\n• ∫sin x dx = -cos x + C\n• ∫cos x dx = sin x + C\n\n**Remember:** Always add the constant 'C' for indefinite integrals!\n\nWant me to solve a specific integral? 🎯";
  }

  if (q.includes('formula') || q.includes('formulas')) {
    return "📝 **Important Formulas**\n\n**Physics:**\n• F = ma (Force)\n• v = u + at (Velocity)\n• s = ut + ½at² (Displacement)\n• E = mc² (Energy)\n\n**Chemistry:**\n• n = m/M (Moles)\n• PV = nRT (Ideal Gas)\n\n**Math:**\n• (a+b)² = a² + 2ab + b²\n• sin²θ + cos²θ = 1\n\nWhich subject formulas do you need? 🎯";
  }

  // Default response with helpful suggestions
  return "I'd be happy to help you with that! 🤔\n\nCould you please be more specific? Here are some things I can help with:\n\n📚 **Subjects:** Physics, Chemistry, Biology, Mathematics\n📝 **Topics:** Atomic structure, Newton's laws, Photosynthesis, Calculus\n💡 **Study Help:** Exam tips, formulas, problem solving\n\nJust ask about any topic and I'll explain it in simple terms!";
};

export default function AiTutorScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: "Hello! 👋 I'm your AI study buddy, MotiMate!\n\nI can help you with:\n• 📚 Subject explanations (Physics, Chemistry, Bio, Math)\n• 💡 Exam preparation tips\n• 🔢 Problem solving\n• 🌐 Regional language support\n\nTry clicking on a suggestion below or ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: getAiResponse(input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen lg:h-auto lg:min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.img
              src={aiTutorAvatar}
              alt="AI Tutor"
              className="w-10 h-10 object-contain"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div>
              <h1 className="font-bold">MotiMate AI</h1>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Online - Ready to help!
              </p>
            </div>
          </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-36 lg:pb-24">
          {/* AI Avatar intro */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-4"
          >
            <motion.img
              src={aiTutorAvatar}
              alt="AI Tutor"
              className="w-28 h-28 object-contain mb-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-primary" />
              <h3 className="font-bold text-lg">MotiMate AI</h3>
              <Sparkles size={16} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Your personal study companion</p>
          </motion.div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-2 mb-4"
            >
              {suggestionCategories.map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSuggestion(suggestion.text)}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-card border border-border text-left hover:border-primary transition-colors"
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <suggestion.icon size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                    <p className="text-sm font-medium truncate">{suggestion.text}</p>
                  </div>
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
                  className={`${message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'} max-w-[85%]`}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
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
              <div className="chat-bubble-bot flex gap-1.5 py-3 px-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 lg:relative lg:mt-auto px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent lg:from-transparent lg:border-t lg:border-border lg:bg-card">
          <div className="max-w-md mx-auto lg:max-w-none flex items-center gap-2 bg-card rounded-2xl p-2 shadow-card border border-border">
            <button className="p-2.5 rounded-full hover:bg-muted transition-colors">
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
              className="p-2.5 rounded-full bg-primary text-primary-foreground disabled:opacity-50"
              whileTap={{ scale: 0.9 }}
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
