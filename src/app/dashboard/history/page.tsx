'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeatherHistory } from '@/hooks/useWeather';
import { useAppDispatch } from '@/store';
import { setCurrentCity } from '@/store/weatherSlice';
import { formatDate, formatTime } from '@/lib/formatters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SearchHistoryItem } from '@/types';

export default function HistoryPage() {
  const { historyData, isLoading, error, refreshHistory } = useWeatherHistory();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewWeather = (city: string) => {
    dispatch(setCurrentCity(city));
    router.push('/dashboard');
  };

  // Filter history items by search term
  const filteredHistory = historyData?.filter((item: SearchHistoryItem) => 
    item.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Weather Search History
        </h1>
        <p className="text-gray-600">
          View your recent weather searches and click on a city to see the current weather.
        </p>
      </header>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <button
            onClick={() => refreshHistory()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg ml-4 flex items-center"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No search history found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No results match your search.' : 'Start searching for weather to build your history.'}
          </p>
        </div>
      )}

      {!isLoading && filteredHistory && filteredHistory.length > 0 && (
        <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  City
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Weather
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Temperature
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((item: SearchHistoryItem) => {
                const result = typeof item.result === 'string' 
                  ? JSON.parse(item.result) 
                  : item.result;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.city}</div>
                      {result.sys && <div className="text-sm text-gray-500">{result.sys.country}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(item.createdAt / 1000)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(item.createdAt / 1000)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.weather && (
                        <div className="flex items-center">
                          <img
                            src={`https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`}
                            alt={result.weather[0].description}
                            width={40}
                            height={40}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-900 capitalize">
                            {result.weather[0].description}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.main && (
                        <div className="text-sm text-gray-900">
                          {Math.round(result.main.temp)}°C
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewWeather(item.city)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Weather
                      </button>
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