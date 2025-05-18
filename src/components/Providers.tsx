'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TemperatureProvider } from '@/contexts/TemperatureContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <TemperatureProvider>
          <AuthProvider>{children}</AuthProvider>
        </TemperatureProvider>
      </ThemeProvider>
    </Provider>
  );
} 