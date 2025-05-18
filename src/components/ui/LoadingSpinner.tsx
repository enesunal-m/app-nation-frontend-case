import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  message?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue-600',
  message = 'Loading weather data...'
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div
        className={`${sizeClasses[size]} border-t-transparent border-${color} rounded-full animate-spin`}
      ></div>
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;