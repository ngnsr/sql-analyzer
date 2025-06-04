import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-75"></div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">Loading SQL engine...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;