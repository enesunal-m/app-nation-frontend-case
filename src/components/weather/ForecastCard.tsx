'use client';

import { formatDate, getWeatherIconUrl } from '@/lib/formatters';
import { DayForecast } from '@/types';
import { useTemperature } from '@/contexts/TemperatureContext';
import Image from 'next/image';

interface ForecastCardProps {
  forecast: DayForecast;
  isToday?: boolean;
}

const ForecastCard = ({ forecast, isToday = false }: ForecastCardProps) => {
  const { unit, convertTemp } = useTemperature();
  
  // Use metric units as backend provides data in metric
  const tempUnit = unit === 'celsius' ? '°C' : '°F';
  const speedUnit = 'm/s';
  
  const iconUrl = getWeatherIconUrl(forecast.weather.icon);
  const formattedDate = formatDate(forecast.dateTimestamp);

  // Determine background based on weather condition
  const getCardBackground = () => {
    const weatherMain = forecast.weather.main.toLowerCase();
    if (weatherMain.includes('clear')) return 'bg-gradient-to-br from-sky-400 to-blue-500';
    if (weatherMain.includes('rain')) return 'bg-gradient-to-br from-gray-500 to-slate-700';
    if (weatherMain.includes('cloud')) return 'bg-gradient-to-br from-blue-400 to-indigo-500';
    if (weatherMain.includes('snow')) return 'bg-gradient-to-br from-blue-100 to-indigo-300';
    return 'bg-gradient-to-br from-blue-500 to-indigo-600';
  };
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg shadow-md transition-all duration-300 transform 
                ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                hover:-translate-y-1 hover:shadow-lg dark:shadow-gray-900`}
    >
      {/* Card Header */}
      <div className={`${getCardBackground()} p-3 text-white`}>
        <h3 className="font-medium text-center text-white">
          {isToday ? 'Today' : formattedDate}
        </h3>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 flex flex-col items-center transition-colors duration-200">
        <div className="relative">
          <Image 
            src={iconUrl} 
            alt={forecast.weather.description}
            width={64}
            height={64}
            className="my-2 drop-shadow-md transition-transform duration-300 hover:scale-110"
          />
          {isToday && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full">
              Now
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 capitalize mb-2 text-center">
          {forecast.weather.description}
        </p>
        
        <div className="flex items-center justify-between w-full">
          <span className="text-blue-600 dark:text-blue-400 font-medium transition-colors duration-200">
            {Math.round(convertTemp(forecast.temp.max))}{tempUnit}
          </span>
          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
            {Math.round(convertTemp(forecast.temp.min))}{tempUnit}
          </span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 w-full grid grid-cols-2 gap-2 text-center transition-colors duration-200">
          <div className="hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md p-1 transition-colors duration-200">
            <span className="block text-xs text-gray-500 dark:text-gray-400">Humidity</span>
            <span className="font-medium text-gray-700 dark:text-gray-200">{forecast.humidity}%</span>
          </div>
          <div className="hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md p-1 transition-colors duration-200">
            <span className="block text-xs text-gray-500 dark:text-gray-400">Wind</span>
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {Math.round(forecast.windSpeed)} {speedUnit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;