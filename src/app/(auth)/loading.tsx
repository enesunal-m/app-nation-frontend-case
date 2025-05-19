export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-6 animate-fade-in">
          {/* Lock Icon Animation */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900/30 animate-pulse-slow" />
            <div className="absolute inset-2 rounded-full bg-blue-200 dark:bg-blue-800/40 animate-pulse-slow-delayed" />
            <div className="absolute inset-4 rounded-full bg-blue-300 dark:bg-blue-700/50 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white animate-slide-up">
              Verifying Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-300 animate-slide-up-delayed">
              Please wait while we verify your credentials...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 dark:bg-blue-400 animate-progress" />
          </div>

          {/* Backend Message */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-fade-in-delayed">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Note: The backend is deployed on Render's free plan. If this is the first request after a period of inactivity, it may take a few moments to start up. Thank you for your patience!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 