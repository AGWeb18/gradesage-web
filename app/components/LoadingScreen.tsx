import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Processing Your Data
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This may take a few moments...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
