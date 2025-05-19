import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootLayout from '@/components/RootLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Weather Dashboard',
  description: 'A responsive weather dashboard with real-time data and 5-day forecast',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="transition-colors duration-200">
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200`}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}