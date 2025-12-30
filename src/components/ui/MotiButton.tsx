import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface MotiButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'full';
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

// Primary button component - coral/peach color scheme
export function MotiButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  type = 'button',
  onClick,
}: MotiButtonProps) {
  // Variant styles
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 font-semibold py-3 px-6 rounded-xl transition-all duration-300',
  };

  // Size styles
  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6',
    lg: 'py-4 px-8 text-lg',
    full: 'py-3 px-6 w-full',
  };

  return (
    <motion.button
      type={type}
      className={`${variantStyles[variant]} ${sizeStyles[size]} flex items-center justify-center gap-2 ${className}`}
      disabled={disabled || loading}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
}
