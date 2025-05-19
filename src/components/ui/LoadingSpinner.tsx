import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  showBackendMessage?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...',
  showBackendMessage = true 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-blue-200 dark:border-blue-800`} />
        
        {/* Spinning ring */}
        <div 
          className={`${sizeClasses[size]} rounded-full border-4 border-blue-500 dark:border-blue-400 border-t-transparent animate-spin absolute top-0 left-0`}
        />
      </div>

      {/* Message */}
      <div className="text-center space-y-2">
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {message}
        </p>
        
        {showBackendMessage && (
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Checking backend availability...
          </p>
        )}
      </div>
    </div>
  );
}