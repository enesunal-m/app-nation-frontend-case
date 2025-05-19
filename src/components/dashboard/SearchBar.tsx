'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setCurrentCity, setError } from '@/store/weatherSlice';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Focus the input field when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const city = input.trim();
    
    if (!city) {
      dispatch(setError({ message: 'Please enter a city name' }));
      return;
    }
    
    // Clear any previous errors
    dispatch(setError(null));
    
    // Update the current city in Redux store
    dispatch(setCurrentCity(city));
    
    // Call the onSearch callback
    onSearch(city);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, once: true }}
      className="w-full max-w-2xl mx-auto mb-6"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.div 
          className="relative flex-grow"
          animate={{
            scale: isFocused ? 1.01 : 1,
            boxShadow: isFocused ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none"
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter city name..."
            className={`w-full h-12 py-2 px-4 pl-10 pr-10 rounded-lg border dark:bg-gray-800 dark:text-gray-100 
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200
              ${isFocused ? 'border-blue-400 dark:border-blue-500' : 'border-gray-300 dark:border-gray-700'}`}
            aria-label="City name"
            disabled={isLoading}
          />
          
          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </motion.div>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className={`h-12 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg 
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
            flex items-center justify-center min-w-[100px] shadow-sm ${isLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <motion.div 
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <span>Searching</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span>Search</span>
            </>
          )}
        </motion.button>
      </div>
      
      {/* Popular city suggestions */}
      {!input && !isLoading && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <PopularCityButton city="İstanbul" onClick={() => {
            setInput("İstanbul");
            onSearch("İstanbul");
          }} />
          <PopularCityButton city="Tokyo" onClick={() => {
            setInput("Tokyo");
            onSearch("Tokyo");
          }} />
          <PopularCityButton city="New York" onClick={() => {
            setInput("New York");
            onSearch("New York");
          }} />
          <PopularCityButton city="London" onClick={() => {
            setInput("London");
            onSearch("London");
          }} />
          <PopularCityButton city="Sydney" onClick={() => {
            setInput("Sydney");
            onSearch("Sydney");
          }} />
          <PopularCityButton city="Paris" onClick={() => {
            setInput("Paris");
            onSearch("Paris");
          }} />
        </div>
      )}
    </motion.form>
  );
};

const PopularCityButton = ({ city, onClick }: { city: string; onClick: () => void }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
    >
      {city}
    </motion.button>
  );
};

export default SearchBar;