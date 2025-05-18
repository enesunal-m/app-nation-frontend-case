'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCurrentCity, setError, setLoading } from '@/store/weatherSlice';
import { useWeather } from '@/hooks/useWeather';
import { useAuth } from '@/contexts/AuthContext';

// Components
import SearchBar from '@/components/dashboard/SearchBar';
import WeatherCard from '@/components/weather/WeatherCard';
import ForecastSection from '@/components/weather/ForecastSection';
import ErrorDisplay from '@/components/dashboard/ErrorDisplay';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
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

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Weather Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.name || user?.email}! Search for a city to get the current weather and 5-day forecast.
        </p>
      </header>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      <ErrorDisplay />
      
      {isLoading && <LoadingSpinner />}
      
      {!isLoading && weatherData && (
        <div className="space-y-8">
          <WeatherCard data={weatherData} />
          {dailyForecast.length > 0 && <ForecastSection forecasts={dailyForecast} />}
        </div>
      )}

      {!isLoading && !weatherData && !error && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Search for a city</h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter a city name in the search bar to see the weather information.
          </p>
        </div>
      )}
    </div>
  );
}