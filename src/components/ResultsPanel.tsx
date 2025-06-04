import React from 'react';
import { useSqlStore } from '../store/sqlStore';
import { Table, TableEmpty } from './Table';

const ResultsPanel: React.FC = () => {
  const { queryResults, isLoading } = useSqlStore();

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!queryResults || queryResults.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Query Results</h2>
        <TableEmpty message="No results to display. Run a query to see results." />
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Query Results
        {queryResults.length > 0 && queryResults[0].values.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({queryResults[0].values.length} rows)
          </span>
        )}
      </h2>
      
      <div className="overflow-x-auto">
        {queryResults.map((result, index) => (
          <div key={index} className="mb-4 last:mb-0">
            {queryResults.length > 1 && (
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Result Set {index + 1}
              </h3>
            )}
            <Table columns={result.columns} data={result.values} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPanel;