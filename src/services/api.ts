import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { WeatherResponse, ForecastResponse } from '@/types';
import Cookies from 'js-cookie';

// Create base API instance
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.app-nation-case.live/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token interceptor
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });
        
        // Store new tokens
        const { access_token, refresh_token } = response.data;
        Cookies.set('accessToken', access_token, { secure: true, sameSite: 'strict' });
        Cookies.set('refreshToken', refresh_token, { secure: true, sameSite: 'strict' });
        
        // Retry the original request with the new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${baseURL}/auth/login`, 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => {
            return status >= 200 && status < 500;
          }
        }
      );
      
      if (response.status >= 400) {
        throw new Error(response.data?.message || 'Invalid credentials');
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed. Please check your credentials.');
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  logout: async (refreshToken: string) => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  },
  
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// Weather API
export const weatherAPI = {
  // Get current weather by city name
  getWeatherByCity: async (city: string): Promise<WeatherResponse> => {
    try {
      const response = await api.get(`/weather/city/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`City '${city}' not found. Please check the spelling and try again.`);
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
      }
      throw new Error('An unexpected error occurred');
    }
  },
  
  // Get weather by coordinates
  getWeatherByCoordinates: async (lat: number, lon: number): Promise<WeatherResponse> => {
    try {
      const response = await api.get(`/weather/coordinates`, {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
      }
      throw new Error('An unexpected error occurred');
    }
  },
  
  // Get both current weather and forecast in a single request
  getWeatherAndForecast: async (city: string): Promise<{ current: WeatherResponse; forecast: ForecastResponse }> => {
    try {
      const response = await api.get(`/weather/combined/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`City '${city}' not found. Please check the spelling and try again.`);
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
      }
      throw new Error('An unexpected error occurred');
    }
  },
  
  // Get 5-day forecast
  getForecast: async (city: string): Promise<ForecastResponse> => {
    try {
      const response = await api.get(`/weather/forecast/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`City '${city}' not found. Please check the spelling and try again.`);
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch forecast data');
      }
      throw new Error('An unexpected error occurred');
    }
  },
  
  // Get weather query history
  getWeatherHistory: async () => {
    const response = await api.get('/weather/history');
    return response.data;
  },
};

export default api;