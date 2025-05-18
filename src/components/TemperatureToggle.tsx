import { useTemperature } from '@/contexts/TemperatureContext';

export default function TemperatureToggle() {
  const { unit, toggleUnit } = useTemperature();

  return (
    <button
      onClick={toggleUnit}
      className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
    >
      <span className={unit === 'celsius' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}>
        °C
      </span>
      <span className="mx-1 text-gray-400 dark:text-gray-500">/</span>
      <span className={unit === 'fahrenheit' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}>
        °F
      </span>
    </button>
  );
} 