'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDate, formatTime, getWeatherIconUrl } from '@/lib/formatters';
import { WeatherResponse } from '@/types';
import { useTemperature } from '@/contexts/TemperatureContext';
import { motion } from 'framer-motion';

interface WeatherCardProps {
  data: WeatherResponse;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const [expandDetails, setExpandDetails] = useState(false);
  const { unit, convertTemp } = useTemperature();
  const hasAnimated = useRef(false);
  
  // Weather data might be already parsed or might need parsing
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  // Use metric units as backend provides data in metric
  const tempUnit = unit === 'celsius' ? '°C' : '°F';
  const speedUnit = 'm/s';
  
  // Get the first weather condition (primary)
  const weather = parsedData.weather[0];
  const iconUrl = getWeatherIconUrl(weather.icon);
  
  // Determine gradient based on temperature
  const getGradientClass = () => {
    const temp = parsedData.main.temp;
    if (temp > 25) return 'weather-gradient-warm';
    if (temp < 10) return 'weather-gradient-cold';
    if (weather.main.toLowerCase().includes('rain')) return 'weather-gradient-rainy';
    return 'weather-gradient-mild';
  };

  useEffect(() => {
    hasAnimated.current = true;
  }, []);
  
  return (
    <motion.div 
      initial={hasAnimated.current ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, once: true }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg dark:shadow-md"
    >
      {/* Card Header */}
      <div className={`${getGradientClass()} p-4 sm:p-6 text-white shadow-md`}>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold">{parsedData.name}, {parsedData.sys.country}</h2>
            </div>
            <p className="text-blue-100 mt-1">
              {formatDate(parsedData.dt, parsedData.timezone)} | {formatTime(parsedData.dt, parsedData.timezone)}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-bold transition-all duration-300">
              {Math.round(convertTemp(parsedData.main.temp))}{tempUnit}
            </span>
            <span className="text-blue-100">
              Feels like {Math.round(convertTemp(parsedData.main.feels_like))}{tempUnit}
            </span>
          </div>
        </div>
      </div>
      
      {/* Weather Icon and Description */}
      <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-700 transition-all duration-200">
        <div className="flex flex-col items-center px-4 py-2">
          <img
            src={iconUrl}
            alt={weather.description}
            width={100}
            height={100}
            className="h-24 w-24 filter drop-shadow-md animate-pulse-slow"
          />
          <p className="text-gray-800 dark:text-gray-100 text-lg capitalize font-medium transition-colors duration-200">
            {weather.description}
          </p>
        </div>
      </div>
      
      {/* Main Weather Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 text-center">
        <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-blue-500 dark:text-blue-400 mb-2"
          >
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Humidity</span>
          <span className="font-semibold text-lg text-gray-700 dark:text-gray-200 transition-colors duration-200">{parsedData.main.humidity}%</span>
        </div>
        
        <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-blue-500 dark:text-blue-400 mb-2"
          >
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Wind</span>
          <span className="font-semibold text-lg text-gray-700 dark:text-gray-200 transition-colors duration-200">{Math.round(parsedData.wind.speed)} {speedUnit}</span>
        </div>
        
        <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-blue-500 dark:text-blue-400 mb-2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Pressure</span>
          <span className="font-semibold text-lg text-gray-700 dark:text-gray-200 transition-colors duration-200">{parsedData.main.pressure} hPa</span>
        </div>
        
        <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-blue-500 dark:text-blue-400 mb-2"
          >
            <path d="M2 12h6"></path>
            <path d="M22 12h-6"></path>
            <path d="M12 2v6"></path>
            <path d="M12 22v-6"></path>
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Visibility</span>
          <span className="font-semibold text-lg text-gray-700 dark:text-gray-200 transition-colors duration-200">{(parsedData.visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>
      
      {/* Expandable Extra Details */}
      <div className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <button
          onClick={() => setExpandDetails(!expandDetails)}
          className="w-full py-3 px-4 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <span>{expandDetails ? 'Hide' : 'Show'} more details</span>
          <motion.svg 
            animate={{ rotate: expandDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="ml-2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </motion.svg>
        </button>
        
        <motion.div 
          animate={{
            height: expandDetails ? 'auto' : 0,
            opacity: expandDetails ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="bg-gray-50 dark:bg-gray-700 grid grid-cols-2 gap-4 text-center overflow-hidden"
          style={{ padding: expandDetails ? '1rem' : 0 }}
        >
          <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
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
              className="text-amber-500 dark:text-amber-400 mb-2"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Sunrise</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-200">{formatTime(parsedData.sys.sunrise, parsedData.timezone)}</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
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
              className="text-indigo-500 dark:text-indigo-400 mb-2"
            >
              <path d="M17 18a5 5 0 0 0-10 0"></path>
              <line x1="12" y1="2" x2="12" y2="9"></line>
              <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
              <line x1="1" y1="18" x2="3" y2="18"></line>
              <line x1="21" y1="18" x2="23" y2="18"></line>
              <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
              <line x1="23" y1="22" x2="1" y2="22"></line>
              <polyline points="8 6 12 2 16 6"></polyline>
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Sunset</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-200">{formatTime(parsedData.sys.sunset, parsedData.timezone)}</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
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
              className="text-blue-500 dark:text-blue-400 mb-2"
            >
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Min Temp</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-200">{Math.round(convertTemp(parsedData.main.temp_min))}{tempUnit}</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
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
              className="text-red-500 dark:text-red-400 mb-2"
            >
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Max Temp</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-200">{Math.round(convertTemp(parsedData.main.temp_max))}{tempUnit}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;