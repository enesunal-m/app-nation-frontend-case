'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import TemperatureToggle from '@/components/ui/TemperatureToggle';
import { motion } from 'framer-motion';
import { 
  HiOutlineHome, 
  HiOutlineClock, 
  HiOutlineCog6Tooth,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2';

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
              <HiOutlineHome className="h-4 w-4 mr-1.5" />
              Home
            </NavLink>
            
            <NavLink 
              path="/dashboard/history" 
              isActive={isActive('/dashboard/history')} 
              isNavigating={isNavigating} 
              onClick={() => handleNavigation('/dashboard/history')}
            >
              <HiOutlineClock className="h-4 w-4 mr-1.5" />
              History
            </NavLink>
            
            {user?.role === 'ADMIN' && (
              <NavLink 
                path="/dashboard/admin" 
                isActive={isActive('/dashboard/admin')} 
                isNavigating={isNavigating} 
                onClick={() => handleNavigation('/dashboard/admin')}
              >
                <HiOutlineCog6Tooth className="h-4 w-4 mr-1.5" />
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
                  <span className="mr-2 pl-1 text-sm font-medium hidden sm:inline-block max-w-[120px] truncate">
                    {user?.name || user?.email}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <button
                    onClick={() => logout()}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                  <HiOutlineBars3 className="h-6 w-6" />
                ) : (
                  <HiOutlineXMark className="h-6 w-6" />
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
            <HiOutlineHome className="h-5 w-5 mr-3" />
            Home
          </MobileNavLink>
          
          <MobileNavLink 
            path="/dashboard/history" 
            isActive={isActive('/dashboard/history')} 
            isNavigating={isNavigating}
            onClick={() => handleNavigation('/dashboard/history')}
          >
            <HiOutlineClock className="h-5 w-5 mr-3" />
            History
          </MobileNavLink>
          
          {user?.role === 'ADMIN' && (
            <MobileNavLink 
              path="/dashboard/admin" 
              isActive={isActive('/dashboard/admin')} 
              isNavigating={isNavigating}
              onClick={() => handleNavigation('/dashboard/admin')}
            >
              <HiOutlineCog6Tooth className="h-5 w-5 mr-3" />
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
              <HiOutlineArrowRightOnRectangle className="h-5 w-5 mr-3" />
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