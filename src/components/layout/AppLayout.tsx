import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

// Responsive layout - desktop pe sidebar, mobile pe bottom nav
export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full">
      {/* Desktop Sidebar */}
      {showNav && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-1 lg:max-w-none max-w-md mx-auto w-full">
        {children}
      </div>
      
      {/* Mobile Bottom Nav */}
      {showNav && (
        <div className="lg:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
