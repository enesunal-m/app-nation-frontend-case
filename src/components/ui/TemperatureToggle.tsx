'use client';

import { useTemperature } from '@/contexts/TemperatureContext';
import { useEffect, useState } from 'react';

export default function TemperatureToggle() {
  const { unit, toggleUnit } = useTemperature();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only showing after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="h-8 w-16"></div>; // Placeholder during SSR
  }

  const isCelsius = unit === 'celsius';

  return (
    <button
      onClick={toggleUnit}
      className="relative inline-flex items-center gap-1 px-3 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40
        text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800
        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      aria-pressed={!isCelsius}
      aria-label={`Toggle to ${isCelsius ? 'Fahrenheit' : 'Celsius'}`}
    >
      <span className={`transition-all duration-300 ${isCelsius ? 'font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
        °C
      </span>
      
      {/* Toggle Switch */}
      <div className="relative mx-1 w-8 h-4 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors">
        <span 
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 
            transition-transform duration-300 ${isCelsius ? '' : 'translate-x-4'}`}
        ></span>
      </div>
      
      <span className={`transition-all duration-300 ${!isCelsius ? 'font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
        °F
      </span>
    </button>
  );
}