import useSWR from 'swr';
import { weatherAPI } from '@/services/api';
import { ForecastResponse, WeatherResponse, DayForecast } from '@/types';
import { groupForecastByDay } from '@/lib/formatters';

// Typed fetcher for SWR
const weatherAndForecastFetcher = async ([_, city]: readonly [string, string]): Promise<{
  current: WeatherResponse;
  forecast: ForecastResponse;
}> => {
  if (!city) throw new Error('City is required');
  return await weatherAPI.getWeatherAndForecast(city);
};

export const useWeather = (city: string) => {
  // Fetch both current weather and forecast data
  const { 
    data, 
    error, 
    isLoading,
    mutate
  } = useSWR<{
    current: WeatherResponse;
    forecast: ForecastResponse;
  }>(
    city ? ['weather-and-forecast', city] : null,
    weatherAndForecastFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );
  
  // Process the forecast data
  const dailyForecast: DayForecast[] = data?.forecast 
    ? groupForecastByDay(data.forecast).slice(0, 5) // Next 5 days
    : [];
  
  return {
    weatherData: data?.current,
    forecastData: data?.forecast,
    dailyForecast,
    error,
    isLoading,
    refreshData: mutate
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