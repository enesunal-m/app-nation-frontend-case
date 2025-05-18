import useSWR from 'swr';
import { getCurrentWeather, getForecast, groupForecastByDay } from '@/lib/api';
import { TemperatureUnit, WeatherResponse, ForecastResponse, DayForecast } from '@/types/weather';

// Typed fetchers for SWR
const currentWeatherFetcher = async ([_, city, units]: readonly [string, string, TemperatureUnit]): Promise<WeatherResponse> => {
  if (!city) throw new Error('City is required');
  return await getCurrentWeather(city, units);
};

const forecastWeatherFetcher = async ([_, city, units]: readonly [string, string, TemperatureUnit]): Promise<ForecastResponse> => {
  if (!city) throw new Error('City is required');
  return await getForecast(city, units);
};

export const useWeather = (city: string, units: TemperatureUnit = 'metric') => {
  // Fetch current weather
  const { 
    data: weatherData, 
    error: weatherError, 
    isLoading: isWeatherLoading,
  } = useSWR<WeatherResponse>(
    city ? ['weather', city, units] : null,
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
  } = useSWR<ForecastResponse>(
    city ? ['forecast', city, units] : null,
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
  
  return {
    weatherData,
    forecastData,
    dailyForecast,
    error: weatherError || forecastError,
    isLoading: isWeatherLoading || isForecastLoading
  };
};