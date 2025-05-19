import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  message?: string;
  center?: boolean;
}

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue-600',
  message = 'Loading weather data...',
  center = true
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const getContainerClass = () => {
    return center ? 'flex flex-col items-center justify-center py-6' : 'py-6';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={getContainerClass()}
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} border-t-transparent border-${color} dark:border-blue-400 rounded-full mx-auto`}
        ></motion.div>
        
        {/* Pulse effect overlay */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            times: [0, 0.5, 1]
          }}
          className={`absolute top-0 left-0 right-0 bottom-0 ${sizeClasses[size]} border border-${color} dark:border-blue-400 rounded-full mx-auto`}
        ></motion.div>
      </div>
      
      {message && (
        <motion.p 
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-gray-600 dark:text-gray-300 text-center"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;