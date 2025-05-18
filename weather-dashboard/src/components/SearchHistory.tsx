'use client';

import { useAppSelector, useAppDispatch } from '@/store';
import { removeFromHistory, clearHistory } from '@/store/historySlice';
import { formatDate } from '@/lib/api';

interface SearchHistoryProps {
  onSelectCity: (city: string) => void;
}

const SearchHistory = ({ onSelectCity }: SearchHistoryProps) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.history);
  
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-700">Recent Searches</h2>
        <button
          onClick={() => dispatch(clearHistory())}
          className="text-sm text-red-500 hover:text-red-700 transition duration-200"
          aria-label="Clear search history"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {items.map((item) => (
          <div 
            key={item.id}
            className="group flex justify-between items-center py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
            onClick={() => onSelectCity(item.city)}
          >
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-gray-400 mr-3"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div>
                <div className="font-medium text-gray-800">{item.city}</div>
                <div className="text-xs text-gray-500">{item.country} • {formatDate(item.timestamp / 1000)}</div>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(removeFromHistory(item.id));
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity duration-200"
              aria-label={`Remove ${item.city} from history`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;