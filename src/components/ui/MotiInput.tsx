import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MotiInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

// Custom input component with coral theme styling
export const MotiInput = forwardRef<HTMLInputElement, MotiInputProps>(
  ({ label, error, icon, rightIcon, className = '', ...props }, ref) => {
    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`moti-input ${icon ? 'pl-12' : ''} ${rightIcon ? 'pr-12' : ''} ${
              error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

MotiInput.displayName = 'MotiInput';
