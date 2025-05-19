'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWeatherHistory } from '@/hooks/useWeather';
import { useAppDispatch } from '@/store';
import { setCurrentCity } from '@/store/weatherSlice';
import { formatDate, formatTime, getWeatherIconUrl } from '@/lib/formatters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SearchHistoryItem } from '@/types';
import { useTemperature } from '@/contexts/TemperatureContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
export default function HistoryPage() {
  const { historyData, isLoading, error, refreshHistory } = useWeatherHistory();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { unit, convertTemp } = useTemperature();
  const containerRef = useRef<HTMLDivElement>(null);

  // Refresh history data when the page is mounted
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const handleViewWeather = (city: string) => {
    dispatch(setCurrentCity(city));
    router.push('/dashboard');
  };

  // Filter history items by search term
  const filteredHistory = historyData?.filter((item: SearchHistoryItem) => 
    item.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Search History</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your recent weather searches and click on a city to see the current weather.
        </p>
      </header>

      {/* Search and Controls Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search in history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* View mode toggle */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center p-1 mr-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                aria-label="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                aria-label="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
            
            <button
              onClick={() => refreshHistory()}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400 dark:text-red-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                {error.message || 'Error loading history. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && filteredHistory && filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No search history found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No results match your search.' : 'Start searching for weather to build your history.'}
          </p>
        </div>
      )}

      {!isLoading && filteredHistory && filteredHistory.length > 0 && (
        <div ref={containerRef}>
          {viewMode === 'list' ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <motion.table 
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      City
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Date & Time
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Weather
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Temperature
                    </th>
                    <th scope="col" className="relative px-4 sm:px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {filteredHistory.map((item: SearchHistoryItem) => {
                      const weatherData = item.result?.current || item.result;
                      const parsedWeather = typeof weatherData === 'string' 
                        ? JSON.parse(weatherData) 
                        : weatherData;
                      
                      return (
                        <motion.tr 
                          key={item.id}
                          variants={itemVariants}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                        >
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{item.city}</div>
                              {parsedWeather.sys && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">{parsedWeather.sys.country}</div>
                              )}
                              <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden mt-1">
                                {formatDate(item.createdAt)}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {formatDate(item.createdAt)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(item.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {parsedWeather.weather && (
                              <div className="flex items-center">
                                <Image
                                  src={getWeatherIconUrl(parsedWeather.weather[0].icon)}
                                  alt={parsedWeather.weather[0].description}
                                  width={40}
                                  height={40}
                                  className="mr-2 rounded-full bg-gray-100 dark:bg-gray-700 p-1"
                                />
                                <span className="text-sm text-gray-900 dark:text-gray-100 capitalize truncate max-w-[100px] md:max-w-none">
                                  {parsedWeather.weather[0].description}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            {parsedWeather.main && (
                              <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                                {Math.round(convertTemp(parsedWeather.main.temp))}{unit === 'celsius' ? '°C' : '°F'}
                              </div>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              onClick={() => handleViewWeather(item.city)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium"
                            >
                              View
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </motion.table>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredHistory.map((item: SearchHistoryItem) => {
                const weatherData = item.result?.current || item.result;
                const parsedWeather = typeof weatherData === 'string' 
                  ? JSON.parse(weatherData) 
                  : weatherData;
                
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
                      <div className="flex justify-between items-center">
                        <div className="text-white">
                          <h3 className="font-bold text-lg">{item.city}</h3>
                          <p className="text-blue-100 text-xs">{parsedWeather.sys?.country}</p>
                        </div>
                        <span className="text-white text-xs bg-blue-600/50 rounded-full px-2 py-1">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        {parsedWeather.weather && (
                          <>
                            <Image
                              src={getWeatherIconUrl(parsedWeather.weather[0].icon)}
                              alt={parsedWeather.weather[0].description}
                              width={50}
                              height={50}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-medium capitalize text-gray-800 dark:text-gray-200">
                                {parsedWeather.weather[0].description}
                              </div>
                              {parsedWeather.main && (
                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                  {Math.round(convertTemp(parsedWeather.main.temp))}{unit === 'celsius' ? '°C' : '°F'}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(item.createdAt)}
                        </div>
                        <button
                          onClick={() => handleViewWeather(item.city)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View Weather
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}