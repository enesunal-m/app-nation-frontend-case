'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from '@/store';
import { setCurrentCity, setError, setLoading } from '@/store/weatherSlice';
import { addToHistory, loadHistoryFromStorage } from '@/store/historySlice';
import { useWeather } from '@/hooks/useWeather';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SearchHistoryItem } from '@/types/weather';

// Components
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import ForecastSection from '@/components/ForecastSection';
import SearchHistory from '@/components/SearchHistory';
import UnitToggle from '@/components/UnitToggle';
import ErrorDisplay from '@/components/ErrorDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';

// Main content component (inside Redux provider)
const WeatherDashboard = () => {
  const dispatch = useAppDispatch();
  const { currentCity, units } = useAppSelector((state) => state.weather);
  const [savedHistory] = useLocalStorage<SearchHistoryItem[]>('search-history', []);
  
  // Load search history from localStorage on initial mount
  useEffect(() => {
    if (savedHistory && savedHistory.length > 0) {
      dispatch(loadHistoryFromStorage(savedHistory));
    }
  }, [dispatch]); // Remove savedHistory from dependencies to prevent loops

  // Fetch weather data using SWR hook
  const { weatherData, dailyForecast, error, isLoading } = useWeather(currentCity, units);

  // Handle search
  const handleSearch = (city: string) => {
    dispatch(setLoading(true));
    dispatch(setCurrentCity(city));
  };

  // Handle selecting a city from history
  const handleSelectCity = (city: string) => {
    dispatch(setCurrentCity(city));
  };

  // Add to history when we get valid weather data
  useEffect(() => {
    if (weatherData && !error && currentCity) {
      // Only add to history if we have real data and an actual city search
      dispatch(
        addToHistory({
          city: weatherData.name,
          country: weatherData.sys.country,
        })
      );
    }
  }, [weatherData?.name, weatherData?.sys?.country, error, dispatch]); // Use specific properties to prevent loops

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
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Weather Dashboard
          </h1>
          <p className="text-gray-600">
            Search for a city to get the current weather and 5-day forecast
          </p>
        </header>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        <UnitToggle />
        <ErrorDisplay />
        
        <SearchHistory onSelectCity={handleSelectCity} />
        
        {isLoading && <LoadingSpinner />}
        
        {!isLoading && weatherData && (
          <div className="space-y-8">
            <WeatherCard data={weatherData} />
            <ForecastSection forecasts={dailyForecast} />
          </div>
        )}
      </div>
    </main>
  );
};

// Page component with Redux provider
export default function Home() {
  return (
    <Provider store={store}>
      <WeatherDashboard />
    </Provider>
  );
}