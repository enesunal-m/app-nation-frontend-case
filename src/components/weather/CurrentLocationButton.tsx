import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMapPin } from 'react-icons/hi2';

interface CurrentLocationButtonProps {
  onLocationDetected: (lat: number, lon: number) => void;
  disabled?: boolean;
}

const CurrentLocationButton = ({ onLocationDetected, disabled = false }: CurrentLocationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationDetected(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Please allow location access to use this feature');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setError('The request to get your location timed out');
            break;
          default:
            setError('An unknown error occurred while getting your location');
            break;
        }
        setIsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={handleGetLocation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 
          hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors duration-200 flex items-center gap-1.5
          ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        disabled={disabled || isLoading}
        aria-label="Get current location"
        title="Get weather for your current location"
      >
        {isLoading ? (
          <motion.div 
            className="h-3.5 w-3.5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        ) : (
          <HiOutlineMapPin className="h-3.5 w-3.5" />
        )}
        <span>Current Location</span>
      </motion.button>
      
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-100 dark:bg-red-900/30 
          text-red-700 dark:text-red-300 text-xs rounded-md shadow-sm z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default CurrentLocationButton;