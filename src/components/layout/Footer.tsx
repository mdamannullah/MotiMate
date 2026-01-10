import { Heart } from 'lucide-react';

// Footer Component - Made with love credit and company info
// Future mein email integration ke liye is component ko update karein
export const Footer = () => {
  return (
    <footer className="py-6 px-4 text-center space-y-2">
      {/* Made with love line */}
      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
        Made with <Heart size={14} className="text-red-500 fill-red-500" /> by{' '}
        <span className="font-medium text-foreground">Mohammad Amannullah</span>
      </p>
      
      {/* Company name */}
      <p className="text-xs text-muted-foreground">
        Moti Software Private Limited{' '}
        <span className="text-muted-foreground/70">( A Moti Global Ventures Company )</span>
      </p>
    </footer>
  );
};