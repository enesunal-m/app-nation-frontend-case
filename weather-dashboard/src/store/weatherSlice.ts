import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TemperatureUnit, WeatherError } from '@/types/weather';

interface WeatherState {
  currentCity: string;
  units: TemperatureUnit;
  error: WeatherError | null;
  isLoading: boolean;
}

const initialState: WeatherState = {
  currentCity: '',
  units: 'metric', // Default to Celsius
  error: null,
  isLoading: false,
};

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCurrentCity: (state, action: PayloadAction<string>) => {
      state.currentCity = action.payload;
    },
    toggleUnits: (state) => {
      state.units = state.units === 'metric' ? 'imperial' : 'metric';
    },
    setUnits: (state, action: PayloadAction<TemperatureUnit>) => {
      state.units = action.payload;
    },
    setError: (state, action: PayloadAction<WeatherError | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearWeatherState: (state) => {
      state.currentCity = '';
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { 
  setCurrentCity, 
  toggleUnits, 
  setUnits,
  setError,
  setLoading,
  clearWeatherState
} = weatherSlice.actions;

export default weatherSlice.reducer;