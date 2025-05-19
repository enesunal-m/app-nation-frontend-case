'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWeatherHistory } from '@/hooks/useWeather';
import { formatDate, formatTime, getWeatherIconUrl } from '@/lib/formatters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SearchHistoryItem } from '@/types';
import { useTemperature } from '@/contexts/TemperatureContext';

export default function AdminPage() {
  const { user } = useAuth();
  const { historyData, isLoading, error, refreshHistory } = useWeatherHistory();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'city' | 'user'>('city');
  const { unit, convertTemp } = useTemperature();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Refresh history data when the page is mounted
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);
  
  // Filter history items by search term
  const filteredHistory = historyData?.filter((item: SearchHistoryItem) => {
    if (filterBy === 'city') {
      return item.city.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return item.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.user?.name && item.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  });

  if (!user || user.role !== 'ADMIN') {
    return (
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="text-center mb-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          View all user queries and weather data.
        </p>
      </header>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="w-full sm:w-auto flex-grow relative max-w-md">
            <input
              type="text"
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Search by ${filterBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center space-x-2 mr-4">
              <label className="text-sm text-gray-700 dark:text-gray-300">Filter by:</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as 'city' | 'user')}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="city">City</option>
                <option value="user">User</option>
              </select>
            </div>

            <button
              onClick={() => refreshHistory()}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
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
              Refresh
            </button>
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
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
              <p className="text-sm text-red-700">
                {error.message || 'Error loading history. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && filteredHistory && filteredHistory.length === 0 && (
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No queries found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No results match your search.' : 'No weather queries have been made yet.'}
          </p>
        </div>
      )}

      {!isLoading && filteredHistory && filteredHistory.length > 0 && (
        <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  City
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Weather
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Temperature
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredHistory.map((item: SearchHistoryItem) => {
                // Extract weather data from the result
                const weatherData = item.result?.current || item.result;
                const parsedWeather = typeof weatherData === 'string' 
                  ? JSON.parse(weatherData) 
                  : weatherData;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.user ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.user.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.user.email}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">Unknown</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.city}</div>
                      {parsedWeather.sys && <div className="text-sm text-gray-500 dark:text-gray-400">{parsedWeather.sys.country}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(item.createdAt)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(item.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parsedWeather.weather && (
                        <div className="flex items-center">
                          <img
                            src={getWeatherIconUrl(parsedWeather.weather[0].icon)}
                            alt={parsedWeather.weather[0].description}
                            width={40}
                            height={40}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                            {parsedWeather.weather[0].description}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parsedWeather.main && (
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {Math.round(convertTemp(parsedWeather.main.temp))}{unit === 'celsius' ? '°C' : '°F'}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}