import axios from 'axios';
import { WeatherResponse, ForecastResponse, TemperatureUnit } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_KEY) {
  console.error('OpenWeather API key is missing in environment variables');
}

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
  },
});

// Get current weather for a city
export const getCurrentWeather = async (
  city: string,
  units: TemperatureUnit = 'metric'
): Promise<WeatherResponse> => {
  try {
    const response = await apiClient.get('/weather', {
      params: {
        q: city,
        units,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`City '${city}' not found. Please check the spelling and try again.`);
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Get 5-day forecast for a city
export const getForecast = async (
  city: string,
  units: TemperatureUnit = 'metric'
): Promise<ForecastResponse> => {
  try {
    const response = await apiClient.get('/forecast', {
      params: {
        q: city,
        units,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`City '${city}' not found. Please check the spelling and try again.`);
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch forecast data');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Get current weather by coordinates
export const getWeatherByCoords = async (
  lat: number,
  lon: number,
  units: TemperatureUnit = 'metric'
): Promise<WeatherResponse> => {
  try {
    const response = await apiClient.get('/weather', {
      params: {
        lat,
        lon,
        units,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Helper function to get weather icon URL
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Helper to convert temperature
export const convertTemperature = (temp: number, toUnit: TemperatureUnit): number => {
  if (toUnit === 'metric') {
    // Convert from Fahrenheit to Celsius
    return Math.round((temp - 32) * 5/9);
  } else {
    // Convert from Celsius to Fahrenheit
    return Math.round((temp * 9/5) + 32);
  }
};

// Format date from timestamp
export const formatDate = (timestamp: number, timezone: number = 0): string => {
  // Convert to milliseconds and adjust for timezone
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

// Format time from timestamp
export const formatTime = (timestamp: number, timezone: number = 0): string => {
  // Convert to milliseconds and adjust for timezone
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Group forecast data by day
export const groupForecastByDay = (forecastData: ForecastResponse) => {
  const { list, city } = forecastData;
  const { timezone } = city;
  
  // Group by day
  const groupedByDay = list.reduce((acc, item) => {
    // Convert timestamp to date considering timezone
    const date = new Date((item.dt + timezone) * 1000);
    const day = date.toISOString().split('T')[0];
    
    if (!acc[day]) {
      acc[day] = [];
    }
    
    acc[day].push(item);
    return acc;
  }, {} as Record<string, typeof list>);
  
  // Get one entry per day (mid-day if possible)
  return Object.entries(groupedByDay).map(([date, items]) => {
    // Try to get mid-day forecast (12-15) or the middle item
    const midDayItem = items.find(item => {
      const itemDate = new Date((item.dt + timezone) * 1000);
      const hours = itemDate.getHours();
      return hours >= 12 && hours <= 15;
    }) || items[Math.floor(items.length / 2)];
    
    // Get min/max for the day
    const minTemp = Math.min(...items.map(item => item.main.temp_min));
    const maxTemp = Math.max(...items.map(item => item.main.temp_max));
    
    return {
      date,
      dateTimestamp: midDayItem.dt,
      temp: {
        day: midDayItem.main.temp,
        min: minTemp,
        max: maxTemp
      },
      weather: {
        main: midDayItem.weather[0].main,
        description: midDayItem.weather[0].description,
        icon: midDayItem.weather[0].icon
      },
      humidity: midDayItem.main.humidity,
      windSpeed: midDayItem.wind.speed
    };
  });
};