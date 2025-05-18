'use client';

import { useAppSelector, useAppDispatch } from '@/store';
import { toggleUnits } from '@/store/weatherSlice';

const UnitToggle = () => {
  const dispatch = useAppDispatch();
  const { units } = useAppSelector((state) => state.weather);
  
  const isMetric = units === 'metric';
  
  return (
    <div className="flex items-center justify-center mb-6">
      <span className={`mr-2 text-sm font-medium ${isMetric ? 'text-blue-600' : 'text-gray-500'}`}>°C</span>
      <button
        onClick={() => dispatch(toggleUnits())}
        className="relative inline-flex items-center justify-center h-6 w-12 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-pressed={!isMetric}
        aria-label={`Toggle to ${isMetric ? 'Fahrenheit' : 'Celsius'}`}
      >
        <span className="sr-only">Toggle temperature unit</span>
        <span
          className={`absolute w-full h-full rounded-full transition-colors duration-200 ease-in-out ${
            isMetric ? 'bg-gray-200' : 'bg-blue-600'
          }`}
        ></span>
        <span
          className={`absolute left-0 inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
            isMetric ? 'translate-x-0' : 'translate-x-6'
          }`}
        ></span>
      </button>
      <span className={`ml-2 text-sm font-medium ${!isMetric ? 'text-blue-600' : 'text-gray-500'}`}>°F</span>
    </div>
  );
};

export default UnitToggle;