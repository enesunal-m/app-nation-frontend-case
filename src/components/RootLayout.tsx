'use client';

import { useHealthCheck } from '@/hooks/useHealthCheck';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Providers from '@/components/ui/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isHealthy, isLoading: isHealthCheckLoading } = useHealthCheck();

  if (isHealthCheckLoading || !isHealthy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <LoadingSpinner 
            size="lg" 
            message={isHealthCheckLoading ? "Checking backend status..." : "Backend service is starting up..."}
            showBackendMessage={false}
          />
          
          {!isHealthCheckLoading && !isHealthy && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-fade-in">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Note: The backend is deployed on Render's free plan. If this is the first request after a period of inactivity, it may take a few moments to start up. Thank you for your patience!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <Providers>{children}</Providers>;
} 