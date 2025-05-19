'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import TemperatureToggle from '@/components/ui/TemperatureToggle';
import { motion } from 'framer-motion';

export default function ResponsiveNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if the link matches the current path
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  // Handle navigation in a way that doesn't block the UI
  const handleNavigation = (path: string) => {
    // Only if we're not already navigating
    if (!isNavigating && pathname !== path) {
      setIsNavigating(true);
      
      // Close mobile menu if open
      if (isOpen) {
        setIsOpen(false);
      }
      
      // Delay actual navigation slightly to allow UI update
      setTimeout(() => {
        router.push(path);
        // Reset navigation state after a slight delay
        setTimeout(() => {
          setIsNavigating(false);
        }, 200);
      }, 10);
    }
    
    return false; // Prevent default link behavior
  };
  
  // Reset navigation state on path change
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);
  
  // Listen for scroll events to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50
      transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-shrink-0">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/dashboard');
              }}
              className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center transition-all duration-200 hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 4a1 1 0 011 1v5a1 1 0 11-2 0V5a1 1 0 011-1z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">Weather Dashboard</span>
              <span className="sm:hidden">Weather</span>
            </a>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-1 md:ml-6">
            <NavLink 
              path="/dashboard" 
              isActive={isActive('/dashboard')} 
              isNavigating={isNavigating} 
              onClick={() => handleNavigation('/dashboard')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-7m-6 0L12 5"
                />
              </svg>
              Home
            </NavLink>
            
            <NavLink 
              path="/dashboard/history" 
              isActive={isActive('/dashboard/history')} 
              isNavigating={isNavigating} 
              onClick={() => handleNavigation('/dashboard/history')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              History
            </NavLink>
            
            {user?.role === 'ADMIN' && (
              <NavLink 
                path="/dashboard/admin" 
                isActive={isActive('/dashboard/admin')} 
                isNavigating={isNavigating} 
                onClick={() => handleNavigation('/dashboard/admin')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Admin
              </NavLink>
            )}
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center ml-auto gap-2">
            {/* Desktop controls */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              <div className="transition-all duration-300 hover:scale-105">
                <TemperatureToggle />
              </div>
              <div className="transition-all duration-300 hover:scale-105">
                <ThemeToggle />
              </div>
              
              {/* User dropdown */}
              <div className="relative group ml-2">
                <button
                  className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none transition-all duration-200 group-hover:scale-105"
                  aria-label="User menu"
                >
                  <span className="mr-2 text-sm font-medium hidden sm:inline-block max-w-[120px] truncate">
                    {user?.name || user?.email}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <button
                    onClick={() => logout()}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <motion.div 
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="pt-2 pb-2 space-y-1">
          <MobileNavLink 
            path="/dashboard" 
            isActive={isActive('/dashboard')} 
            isNavigating={isNavigating}
            onClick={() => handleNavigation('/dashboard')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-7m-6 0L12 5"
              />
            </svg>
            Home
          </MobileNavLink>
          
          <MobileNavLink 
            path="/dashboard/history" 
            isActive={isActive('/dashboard/history')} 
            isNavigating={isNavigating}
            onClick={() => handleNavigation('/dashboard/history')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            History
          </MobileNavLink>
          
          {user?.role === 'ADMIN' && (
            <MobileNavLink 
              path="/dashboard/admin" 
              isActive={isActive('/dashboard/admin')} 
              isNavigating={isNavigating}
              onClick={() => handleNavigation('/dashboard/admin')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Admin
            </MobileNavLink>
          )}
        </div>
        
        {/* Mobile user menu */}
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center px-5 py-2">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="text-base font-medium text-gray-800 dark:text-gray-200 truncate">
                {user?.name || user?.email}
              </div>
              {user?.name && (
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 space-y-1 px-3">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Temperature</span>
              <TemperatureToggle />
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Navigation progress indicator */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <motion.div
            className="h-1 bg-blue-500 dark:bg-blue-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
          />
        </div>
      )}
    </nav>
  );
}

// Desktop Navigation Link Component
const NavLink = ({ 
  path, 
  isActive, 
  isNavigating, 
  onClick, 
  children 
}: { 
  path: string; 
  isActive: boolean; 
  isNavigating: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-100'
      } ${isNavigating ? 'opacity-50 pointer-events-none' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ 
  path, 
  isActive, 
  isNavigating, 
  onClick, 
  children 
}: { 
  path: string; 
  isActive: boolean; 
  isNavigating: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center px-4 py-3 text-base font-medium transition-all duration-200 ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-100'
      } ${isNavigating ? 'opacity-50 pointer-events-none' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  );
};