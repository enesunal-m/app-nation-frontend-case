'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TemperatureProvider } from '@/contexts/TemperatureContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <TemperatureProvider>
            {children}
          </TemperatureProvider>
          <Analytics />
          <SpeedInsights />
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
} 