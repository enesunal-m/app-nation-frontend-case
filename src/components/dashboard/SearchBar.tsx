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
      className="flex flex-col sm:flex-row gap-2 w-full max-w-xl mx-auto mb-6"
    >
      <motion.div 
        className="relative flex-grow"
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none"
        }}
        transition={{ duration: 0.2 }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter city name..."
          className={`w-full py-3 px-4 pl-10 rounded-lg border dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300
            ${isFocused ? 'border-blue-400' : 'border-gray-300'}`}
          aria-label="City name"
          disabled={isLoading}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        {input && (
          <motion.button
            type="button"
            onClick={() => setInput('')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </motion.button>
        )}
      </motion.div>
      <motion.button
        type="submit"
        whileHover={{ y: -4, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ y: 0, scale: 0.98 }}
        disabled={isLoading}
        className={`py-3 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg 
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
          flex items-center justify-center ${isLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <motion.div 
            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        )}
        {isLoading ? 'Searching...' : 'Search'}
      </motion.button>
    </motion.form>
  );
};

export default SearchBar;