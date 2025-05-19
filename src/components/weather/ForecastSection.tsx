import { DayForecast } from '@/types';
import { motion } from 'framer-motion';
import ForecastCard from './ForecastCard';

interface ForecastSectionProps {
  forecasts: DayForecast[];
}

const ForecastSection = ({ forecasts }: ForecastSectionProps) => {
  if (!forecasts || forecasts.length === 0) {
    return null;
  }

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
        once: true,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        once: true,
      }
    }
  };

  return (
    <section className="mt-8">
      <motion.h2 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, once: true }}
        className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mr-2 text-blue-500 dark:text-blue-400"
        >
          <path d="M7 10v12"></path>
          <path d="M15 10v12"></path>
          <path d="M11 10v12"></path>
          <path d="M19 10v12"></path>
          <path d="M3 10v12"></path>
          <path d="M21 10a9 9 0 0 0-9-9 9 9 0 0 0-9 9z"></path>
        </svg>
        5-Day Forecast
      </motion.h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {forecasts.map((forecast, index) => (
          <motion.div key={forecast.date} variants={item}>
            <ForecastCard 
              forecast={forecast} 
              isToday={index === 0}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ForecastSection;