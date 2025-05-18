import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchHistoryItem } from '@/types';

interface HistoryState {
  items: SearchHistoryItem[];
  maxItems: number;
}

const initialState: HistoryState = {
  items: [],
  maxItems: 5, // Maximum number of items to store
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<{ city: string; country: string }>) => {
      const { city, country } = action.payload;
      
      // Check if city already exists in history
      const existingIndex = state.items.findIndex(
        item => item.city.toLowerCase() === city.toLowerCase()
      );
      
      // If city exists, remove it (to add it back at the top)
      if (existingIndex !== -1) {
        state.items = state.items.filter((_, index) => index !== existingIndex);
      }
      
      // Add the new city to the top of the history
      state.items.unshift({
        id: Date.now().toString(),
        city,
        country,
        createdAt: Date.now(),
        result: {} // Empty result as it will be filled by the API response
      });
      
      // Limit the history to maxItems
      if (state.items.length > state.maxItems) {
        state.items = state.items.slice(0, state.maxItems);
      }
    },
    clearHistory: (state) => {
      state.items = [];
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    },
    loadHistoryFromStorage: (state, action: PayloadAction<SearchHistoryItem[]>) => {
      state.items = action.payload.slice(0, state.maxItems);
    },
  },
});

export const { 
  addToHistory, 
  clearHistory, 
  removeFromHistory,
  loadHistoryFromStorage
} = historySlice.actions;

export default historySlice.reducer;