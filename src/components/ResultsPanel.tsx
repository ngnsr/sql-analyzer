import { useEffect, useState } from 'react';
import { useSqlStore } from '../store/sqlStore';

export default function ResultsPanel() {
  const { queryResults, error, isLoading } = useSqlStore();
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  useEffect(() => {
    console.log('ResultsPanel render, results:', queryResults, 'isLoading:', isLoading);
    if (!isLoading && (queryResults || error)) {
      setLastRunTime(new Date().toLocaleTimeString());
    }
  }, [isLoading, queryResults, error]);

  if (isLoading) {
    return (
      <div className="results-panel p-4 border rounded bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-2 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-panel p-4 border rounded bg-white dark:bg-gray-800 text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  if (!queryResults || queryResults.length === 0) {
    return (
      <div className="results-panel p-4 border rounded bg-white dark:bg-gray-800">
        No results to display.
      </div>
    );
  }

  return (
    <div className="mt-6">
        <div className="results-panel p-4 border rounded bg-white dark:bg-gray-800">
        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          Last run: {lastRunTime || 'Never'}
        </div>
        {queryResults.map((result, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Result {index + 1}</h3>
            <table className="w-full border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  {result.columns.map((column) => (
                    <th key={column} className="border border-gray-300 dark:border-gray-600 p-2 text-left text-gray-900 dark:text-gray-100">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.values.map((row, rowIndex) => (
                  <tr key={rowIndex} className="even:bg-gray-50 dark:even:bg-gray-900">
                    {row.map((value, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-gray-100">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
     </div>
    </div>
  );
}