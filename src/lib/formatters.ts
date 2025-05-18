/**
 * Get weather icon URL from OpenWeather icon code
 */
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Format date from timestamp
 * @param timestamp Unix timestamp
 * @param timezone Timezone offset in seconds
 */
export const formatDate = (timestamp: number, timezone: number = 0): string => {
  // Convert to milliseconds and adjust for timezone
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format time from timestamp
 * @param timestamp Unix timestamp
 * @param timezone Timezone offset in seconds
 */
export const formatTime = (timestamp: number, timezone: number = 0): string => {
  // Convert to milliseconds and adjust for timezone
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Group forecast data by day
 * This function remains useful even with backend integration, as we might still
 * need to process forecast data from the backend
 */
export const groupForecastByDay = (forecastData: any) => {
  const { list, city } = forecastData;
  const { timezone } = city;
  
  // Group by day
  const groupedByDay = list.reduce((acc: any, item: any) => {
    // Convert timestamp to date considering timezone
    const date = new Date((item.dt + timezone) * 1000);
    const day = date.toISOString().split('T')[0];
    
    if (!acc[day]) {
      acc[day] = [];
    }
    
    acc[day].push(item);
    return acc;
  }, {});
  
  // Get one entry per day (mid-day if possible)
  return Object.entries(groupedByDay).map(([date, items]: [string, any]) => {
    // Try to get mid-day forecast (12-15) or the middle item
    const midDayItem = items.find((item: any) => {
      const itemDate = new Date((item.dt + timezone) * 1000);
      const hours = itemDate.getHours();
      return hours >= 12 && hours <= 15;
    }) || items[Math.floor(items.length / 2)];
    
    // Get min/max for the day
    const minTemp = Math.min(...items.map((item: any) => item.main.temp_min));
    const maxTemp = Math.max(...items.map((item: any) => item.main.temp_max));
    
    return {
      date,
      dateTimestamp: midDayItem.dt,
      temp: {
        day: midDayItem.main.temp,
        min: minTemp,
        max: maxTemp
      },
      weather: {
        main: midDayItem.weather[0].main,
        description: midDayItem.weather[0].description,
        icon: midDayItem.weather[0].icon
      },
      humidity: midDayItem.main.humidity,
      windSpeed: midDayItem.wind.speed
    };
  });
};