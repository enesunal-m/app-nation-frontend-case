'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCurrentCity, setError, setLoading } from '@/store/weatherSlice';
import { useWeather } from '@/hooks/useWeather';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import SearchBar from '@/components/dashboard/SearchBar';
import ErrorDisplay from '@/components/dashboard/ErrorDisplay';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import WeatherCard from '@/components/weather/WeatherCard';
import ForecastSection from '@/components/weather/ForecastSection';

export default function ResponsiveDashboard() {
  const dispatch = useAppDispatch();
  const { currentCity } = useAppSelector((state) => state.weather);
  const { user } = useAuth();
  
  // Fetch weather data using our custom hook
  const { weatherData, dailyForecast, error, isLoading } = useWeather(currentCity);

  // Handle search
  const handleSearch = (city: string) => {
    dispatch(setLoading(true));
    dispatch(setCurrentCity(city));
  };

  // Set error state from SWR error
  useEffect(() => {
    if (error) {
      dispatch(
        setError({
          message: error.message || 'Failed to fetch weather data. Please try again.',
        })
      );
      dispatch(setLoading(false));
    } else if (weatherData) {
      // Clear any errors when we successfully get data
      dispatch(setLoading(false));
      dispatch(setError(null));
    }
  }, [error, weatherData, dispatch]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-6"
    >
      <header className="text-center mb-8">
        <motion.h1 
          variants={itemVariants}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Weather Dashboard
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 dark:text-gray-400 mx-auto max-w-2xl"
        >
          Welcome back, <span className="font-medium text-blue-600 dark:text-blue-400">{user?.name || user?.email}</span>! 
          Search for a city to get the current weather and 5-day forecast.
        </motion.p>
      </header>

      <motion.div variants={itemVariants}>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        <ErrorDisplay />
      </motion.div>
      
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}
        
        {!isLoading && weatherData && (
          <motion.div 
            key="weather-data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <WeatherCard data={weatherData} />
            {dailyForecast.length > 0 && <ForecastSection forecasts={dailyForecast} />}
          </motion.div>
        )}

        {!isLoading && !weatherData && !error && (
          <motion.div 
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg mt-8"
          >
            <svg
              className="mx-auto h-20 w-20 text-gray-400 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No weather data yet</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Enter a city name in the search bar above to get started. You'll see current weather conditions and a 5-day forecast.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => handleSearch('New York')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try New York
              </button>
              <button
                onClick={() => handleSearch('London')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try London
              </button>
              <button
                onClick={() => handleSearch('Tokyo')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Tokyo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}