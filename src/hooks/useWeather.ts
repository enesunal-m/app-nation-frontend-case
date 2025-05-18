import useSWR from 'swr';
import { weatherAPI } from '@/services/api';
import { ForecastResponse, WeatherResponse, DayForecast } from '@/types';
import { groupForecastByDay } from '@/lib/formatters';

// Typed fetchers for SWR
const currentWeatherFetcher = async ([_, city]: readonly [string, string]): Promise<WeatherResponse> => {
  if (!city) throw new Error('City is required');
  return await weatherAPI.getWeatherByCity(city);
};

const forecastWeatherFetcher = async ([_, city]: readonly [string, string]): Promise<ForecastResponse> => {
  if (!city) throw new Error('City is required');
  return await weatherAPI.getForecast(city);
};

export const useWeather = (city: string) => {
  // Fetch current weather
  const { 
    data: weatherData, 
    error: weatherError, 
    isLoading: isWeatherLoading,
    mutate: mutateWeather
  } = useSWR<WeatherResponse>(
    city ? ['weather', city] : null,
    currentWeatherFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );
  
  // Fetch 5-day forecast
  const { 
    data: forecastData, 
    error: forecastError, 
    isLoading: isForecastLoading,
    mutate: mutateForecast
  } = useSWR<ForecastResponse>(
    city ? ['forecast', city] : null,
    forecastWeatherFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );
  
  // Process the forecast data
  const dailyForecast: DayForecast[] = forecastData 
    ? groupForecastByDay(forecastData).slice(0, 5) // Next 5 days
    : [];
  
  // Function to refresh data
  const refreshData = () => {
    mutateWeather();
    mutateForecast();
  };
  
  return {
    weatherData,
    forecastData,
    dailyForecast,
    error: weatherError || forecastError,
    isLoading: isWeatherLoading || isForecastLoading,
    refreshData
  };
};

// Hook for fetching weather history
export const useWeatherHistory = () => {
  const { 
    data: historyData, 
    error, 
    isLoading,
    mutate 
  } = useSWR(
    'weatherHistory',
    async () => await weatherAPI.getWeatherHistory(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );
  
  return {
    historyData,
    error,
    isLoading,
    refreshHistory: mutate
  };
};