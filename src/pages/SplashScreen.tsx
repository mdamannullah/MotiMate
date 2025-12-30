import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import splashMascot from '@/assets/splash-mascot.png';

// Splash screen - app start hone par dikhega
export default function SplashScreen() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Thoda delay ke baad content dikhao
    const timer1 = setTimeout(() => setShowContent(true), 300);
    
    // 2.5 seconds ke baad onboarding par jao
    const timer2 = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem('motimate_onboarding');
      const user = localStorage.getItem('motimate_user');
      
      if (user) {
        navigate('/dashboard', { replace: true });
      } else if (hasSeenOnboarding) {
        navigate('/home', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className="mobile-container flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background via-background to-primary/10">
      <AnimatePresence>
        {showContent && (
          <>
            {/* Logo/Mascot */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <img
                src={splashMascot}
                alt="MotiMate Mascot"
                className="w-48 h-48 object-contain relative z-10"
              />
            </motion.div>

            {/* App Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-4xl font-extrabold gradient-text"
            >
              MotiMate
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-muted-foreground text-center px-8"
            >
              Your AI-Powered Study Companion
            </motion.p>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
