import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import onboarding1 from '@/assets/onboarding-1.png';
import onboarding2 from '@/assets/onboarding-2.png';
import onboarding3 from '@/assets/onboarding-3.png';

// Onboarding slides ka data
const slides = [
  {
    image: onboarding1,
    title: 'Welcome to MotiMate!',
    description: 'Your personal AI study companion that helps you learn better, faster, and smarter.',
  },
  {
    image: onboarding2,
    title: 'Break Language Barriers',
    description: 'Translate lectures from Tamil, Hindi, Kannada, Telugu into English in real-time.',
  },
  {
    image: onboarding3,
    title: 'Achieve Your Goals',
    description: 'AI-generated notes, smart tests, and personalized analytics to help you succeed.',
  },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Next slide par jao
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  // Skip karo aur home jao
  const handleSkip = () => {
    handleComplete();
  };

  // Onboarding complete mark karo
  const handleComplete = () => {
    localStorage.setItem('motimate_onboarding', 'true');
    navigate('/home', { replace: true });
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen">
      {/* Skip button */}
      <div className="absolute top-6 right-6 z-10">
        <motion.button
          onClick={handleSkip}
          className="text-muted-foreground font-medium"
          whileTap={{ scale: 0.95 }}
        >
          Skip
        </motion.button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Image container with soft shadow */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform scale-75" />
              <motion.img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-72 h-72 object-contain relative z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-3">
              {slides[currentSlide].title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-center max-w-xs leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section - dots aur button */}
      <div className="px-6 pb-12 space-y-8">
        {/* Dots indicator */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`onboarding-dot ${currentSlide === index ? 'active' : ''}`}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Next/Get Started button */}
        <MotiButton onClick={handleNext} size="full">
          {currentSlide === slides.length - 1 ? "Let's Get Started" : 'Next'}
        </MotiButton>
      </div>
    </div>
  );
}
