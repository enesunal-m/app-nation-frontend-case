'use client';

import { useAppSelector, useAppDispatch } from '@/store';
import { setError } from '@/store/weatherSlice';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ErrorDisplay = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.weather);

  const handleDismiss = () => {
    dispatch(setError(null));
  };
  
  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.div 
          key="error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md mb-6 overflow-hidden"
        >
          <div className="flex items-start">
            <motion.div 
              className="flex-shrink-0"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-red-500 dark:text-red-400"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </motion.div>
            <div className="ml-3 flex-grow">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                {error.message}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismiss}
                  className="inline-flex rounded-md p-1.5 text-red-500 dark:text-red-400 
                    hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 
                    transition-colors duration-200"
                  aria-label="Dismiss"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorDisplay;