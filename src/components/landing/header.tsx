import React, { useState, useEffect } from 'react';
import { BarChart3, Menu, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/layoutStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HeaderSection() {
  const { isDark, toggleTheme } = useThemeStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStart = () => router.push("/dashboard");
  const handleSignin = () => router.push("/student/signin");

  return (
    <header
      className={`fixed left-1/2 z-50 transform -translate-x-1/2 transition-all duration-500
        ${isScrolled
          ? 'w-[92%] top-4 bg-card/80 backdrop-blur-xl border border-border shadow-lg rounded-full'
          : 'w-full bg-transparent rounded-none shadow-none border-0 top-0'
        }`}
    >
      <nav className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <Image
              src="/progress_iq.png"
              alt="Progress IQ Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent">
                Progress IQ
              </span>
              <div className="text-xs text-muted-foreground">Smart Activity Reporting</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            {['Features', 'Platform', 'Use Cases', 'Integrations', 'Roadmap'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '')}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}

            {/* Theme toggle button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0 cursor-pointer"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <button onClick={handleSignin} className="cursor-pointer px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-primary to-accent-foreground text-white rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all hover:scale-105">
              Get Started
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border space-y-4 animate-in slide-in-from-top duration-300">
            {['Features', 'Platform', 'Use Cases', 'Integrations', 'Roadmap'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '')}`}
                className="block text-muted-foreground hover:text-primary transition-colors py-2"
              >
                {item}
              </a>
            ))}

            <button onClick={handleSignin} className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/50">
              Get Started
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
