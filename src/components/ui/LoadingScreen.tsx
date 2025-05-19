import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LoadingScreen({ message = "Loading application..." }) {
  const [progress, setProgress] = useState(0);
  const [isBackendActive, setIsBackendActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Simulate progress incrementing
  useEffect(() => {
    // Progress increments more slowly at first, then accelerates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Slow start, faster towards the end, but max 95% if backend not confirmed
        const increment = prev < 30 ? 0.5 : prev < 60 ? 1 : 2;
        const newValue = prev + increment;
        return !isBackendActive && newValue > 95 ? 95 : newValue;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isBackendActive]);
  
  // Check backend availability
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.app-nation-case.live/api'}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Very short timeout to avoid long waits
          signal: AbortSignal.timeout(3000),
        });
        
        if (response.ok) {
          setIsBackendActive(true);
          setProgress(100); // Force progress to 100% when backend is confirmed active
        }
      } catch (error) {
        console.log('Backend not ready yet, will retry...');
      }
    };
    
    // Check initially and then every 5 seconds
    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    
    // Increment time elapsed every second
    const timeInterval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);
  
  // Format time elapsed as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get appropriate message based on status and time elapsed
  const getStatusMessage = () => {
    if (isBackendActive) {
      return "Backend is active! Loading application...";
    }
    
    if (timeElapsed < 10) {
      return "Connecting to backend service...";
    } else if (timeElapsed < 30) {
      return "Backend service is starting up...";
    } else {
      return "Backend is activating. This may take up to a minute as we're using a free plan on Render.com.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <div className="mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-blue-600 dark:text-blue-400 text-3xl font-bold inline-flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
            Weather Dashboard
          </motion.div>
        </div>
        
        <div className="mb-8">
          <LoadingSpinner size="lg" message={message} />
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-4 w-full max-w-xs mx-auto overflow-hidden mb-4">
          <motion.div 
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", damping: 10 }}
          />
        </div>
        
        <div className="space-y-3">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            {getStatusMessage()}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            Time elapsed: {formatTime(timeElapsed)}
          </p>
          
          {timeElapsed > 45 && !isBackendActive && (
            <div className="mt-6 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              Taking longer than expected? The free tier backend might be spinning up after inactivity.
              <br />Please be patient, or try refreshing the page.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}