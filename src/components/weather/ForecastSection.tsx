import { DayForecast } from '@/types';
import ForecastCard from './ForecastCard';

interface ForecastSectionProps {
  forecasts: DayForecast[];
}

const ForecastSection = ({ forecasts }: ForecastSectionProps) => {
  if (!forecasts || forecasts.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecasts.map((forecast, index) => (
          <ForecastCard 
            key={forecast.date} 
            forecast={forecast} 
            isToday={index === 0}
          />
        ))}
      </div>
    </section>
  );
};

export default ForecastSection;