'use client';

import { formatDate, getWeatherIconUrl } from '@/lib/formatters';
import { DayForecast } from '@/types';

interface ForecastCardProps {
  forecast: DayForecast;
  isToday?: boolean;
}

const ForecastCard = ({ forecast, isToday = false }: ForecastCardProps) => {
  // Use metric units as backend provides data in metric
  const tempUnit = '°C';
  const speedUnit = 'm/s';
  
  const iconUrl = getWeatherIconUrl(forecast.weather.icon);
  const formattedDate = formatDate(forecast.dateTimestamp);
  
  return (
    <div className={`bg-white rounded-lg shadow p-4 flex flex-col items-center ${isToday ? 'border-2 border-blue-500' : ''}`}>
      <h3 className="font-medium text-gray-700 mb-1">
        {isToday ? 'Today' : formattedDate}
      </h3>
      
      <img 
        src={iconUrl} 
        alt={forecast.weather.description}
        width={64}
        height={64}
        className="my-2"
      />
      
      <p className="text-sm text-gray-600 capitalize mb-2">{forecast.weather.description}</p>
      
      <div className="flex items-center justify-between w-full">
        <span className="text-blue-600 font-medium">{Math.round(forecast.temp.max)}{tempUnit}</span>
        <span className="text-gray-500">{Math.round(forecast.temp.min)}{tempUnit}</span>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 w-full grid grid-cols-2 gap-2 text-center text-xs text-gray-500">
        <div>
          <span className="block">Humidity</span>
          <span className="font-medium text-gray-700">{forecast.humidity}%</span>
        </div>
        <div>
          <span className="block">Wind</span>
          <span className="font-medium text-gray-700">
            {Math.round(forecast.windSpeed)} {speedUnit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;