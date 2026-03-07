import React from 'react';
import Header from './header';
import Sidebar from './sidebar';
import { useSidebarStore } from '@/store/layoutStore';
import { cn } from '@/lib/utils';
import GlobalNotification from '@/components/notify/notification';

interface LayoutWrapperProps {
  children: React.ReactNode;
  headerTitle?: string;
  showSidebar?: boolean;
  showHeader?: boolean;
  className?: string;
  contentClassName?: string;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  children,
  headerTitle,
  showSidebar = true,
  showHeader = true,
  className,
  contentClassName
}) => {
  const { isOpen } = useSidebarStore();

  return (
    <div className={cn("min-h-screen w-screen", className)}>
      <GlobalNotification />
      {/* Sidebar */}
      {showSidebar && <Sidebar />}
      
      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col",
        showSidebar && (isOpen ? "ml-64" : "ml-16"),
        "transition-all duration-300 ease-in-out"
      )}>
        {/* Header */}
        {/* {showHeader && <Header title={headerTitle} />} */}
        
        {/* Main Content */}
        <main className={cn(
          "flex-1",
          showHeader ? "w-full min-h-[calc(100vh-3.5rem)]" : "min-h-screen",
          contentClassName
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {showSidebar && isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => useSidebarStore.getState().closeSidebar()}
        />
      )}
    </div>
  );
};

export default LayoutWrapper;