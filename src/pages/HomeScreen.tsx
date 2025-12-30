import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { BookOpen, Sparkles, Globe, ArrowRight } from 'lucide-react';
import splashMascot from '@/assets/splash-mascot.png';

// Home screen - login se pehle dikhega
export default function HomeScreen() {
  const navigate = useNavigate();

  const features = [
    { icon: Globe, text: 'Translate lectures in real-time' },
    { icon: BookOpen, text: 'AI-generated smart notes' },
    { icon: Sparkles, text: 'Personalized study analytics' },
  ];

  return (
    <div className="mobile-container min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img src={splashMascot} alt="MotiMate" className="w-10 h-10" />
          <span className="font-bold text-xl">MotiMate</span>
        </div>
        <motion.button
          onClick={() => navigate('/about')}
          className="text-muted-foreground font-medium"
          whileTap={{ scale: 0.95 }}
        >
          About
        </motion.button>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex flex-col px-6 pt-8">
        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-extrabold mb-3">
            Study Smarter,<br />
            <span className="gradient-text">Not Harder</span>
          </h1>
          <p className="text-muted-foreground">
            Break language barriers in your classroom with AI-powered translations and smart notes
          </p>
        </motion.div>

        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
            <img
              src={splashMascot}
              alt="AI Tutor"
              className="w-52 h-52 object-contain relative z-10"
            />
          </div>
        </motion.div>

        {/* Features list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3 bg-card rounded-xl p-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon size={20} className="text-primary" />
              </div>
              <span className="font-medium text-foreground">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Bottom buttons */}
      <div className="px-6 pb-8 space-y-3">
        <MotiButton onClick={() => navigate('/login')} size="full">
          Login <ArrowRight size={18} />
        </MotiButton>
        <MotiButton onClick={() => navigate('/signup')} variant="outline" size="full">
          Create Account
        </MotiButton>
        <button
          onClick={() => navigate('/contact')}
          className="w-full text-center text-muted-foreground text-sm py-2"
        >
          Need help? Contact us
        </button>
      </div>
    </div>
  );
}
