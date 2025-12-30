import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MotiCardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  onClick?: () => void;
  animate?: boolean;
  delay?: number;
}

// Custom card component jo reference design se match karta hai
export function MotiCard({
  children,
  className = '',
  elevated = false,
  onClick,
  animate = true,
  delay = 0,
}: MotiCardProps) {
  const cardClass = elevated ? 'moti-card-elevated' : 'moti-card';
  
  if (!animate) {
    return (
      <div 
        className={`${cardClass} ${className} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      className={`${cardClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}
