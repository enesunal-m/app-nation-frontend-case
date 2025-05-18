// Weather response from OpenWeather API
export interface WeatherResponse {
    coord: {
      lon: number;
      lat: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    base: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
      sea_level?: number;
      grnd_level?: number;
    };
    visibility: number;
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    rain?: {
      '1h'?: number;
      '3h'?: number;
    };
    snow?: {
      '1h'?: number;
      '3h'?: number;
    };
    clouds: {
      all: number;
    };
    dt: number;
    sys: {
      type?: number;
      id?: number;
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
  }
  
  // Forecast response from OpenWeather API
  export interface ForecastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: Array<{
      dt: number;
      main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
      };
      weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
      }>;
      clouds: {
        all: number;
      };
      wind: {
        speed: number;
        deg: number;
        gust?: number;
      };
      visibility: number;
      pop: number;
      rain?: {
        '3h'?: number;
      };
      snow?: {
        '3h'?: number;
      };
      sys: {
        pod: string;
      };
      dt_txt: string;
    }>;
    city: {
      id: number;
      name: string;
      coord: {
        lat: number;
        lon: number;
      };
      country: string;
      population: number;
      timezone: number;
      sunrise: number;
      sunset: number;
    };
  }
  
  // Search history item
  export interface SearchHistoryItem {
    id: string;
    city: string;
    country: string;
    timestamp: number;
  }
  
  // Unit system for temperature
  export type TemperatureUnit = 'metric' | 'imperial';
  
  // Weather data object with parsed information
  export interface WeatherData {
    cityName: string;
    country: string;
    temperature: number;
    feelsLike: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    sunrise: number;
    sunset: number;
    timezone: number;
  }
  
  // Day forecast data 
  export interface DayForecast {
    date: string;
    dateTimestamp: number;
    temp: {
      day: number;
      min: number;
      max: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    humidity: number;
    windSpeed: number;
  }
  
  // Error state
  export interface WeatherError {
    message: string;
    code?: number;
  }