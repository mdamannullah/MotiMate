import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

// Ye component app ko mobile container mein wrap karta hai
// Max width set karta hai aur center align karta hai
export function MobileContainer({ 
  children, 
  className = '', 
  animate = true 
}: MobileContainerProps) {
  const Container = animate ? motion.div : 'div';
  
  return (
    <Container
      className={`mobile-container ${className}`}
      initial={animate ? { opacity: 0 } : undefined}
      animate={animate ? { opacity: 1 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {children}
    </Container>
  );
}
