import React from 'react';
import { useSqlStore } from '../store/sqlStore';
import { SqlQueryType } from '../types/sql';
import { LineChart, BarChart, Search } from 'lucide-react';

const VisualizationPanel: React.FC = () => {
  const { parsedQuery } = useSqlStore();

  if (!parsedQuery) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Query Visualization</h2>
        <div className="p-8 flex flex-col items-center justify-center text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <Search className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Execute a query to see its visualization</p>
        </div>
      </div>
    );
  }

  // For SELECT queries, show a visual representation of tables and their relationships
  if (parsedQuery.type === SqlQueryType.SELECT) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Query Visualization</h2>
        
        {/* Simple flow diagram showing query execution */}
        <div className="flex flex-col items-center space-y-4 py-2">
          {/* FROM tables */}
          <div className="flex space-x-4">
            {parsedQuery.from?.map((table, index) => (
              <div key={index} className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center min-w-32">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-300">{table.name}</div>
                {table.alias && <div className="text-xs text-blue-600 dark:text-blue-400">as {table.alias}</div>}
              </div>
            ))}
          </div>
          
          {/* JOIN arrows if applicable */}
          {parsedQuery.joins && parsedQuery.joins.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="h-6 w-0.5 bg-teal-500 dark:bg-teal-600"></div>
              <div className="bg-teal-500 dark:bg-teal-600 text-white text-xs rounded-full px-2 py-1">
                {parsedQuery.joins[0].type} JOIN
              </div>
              <div className="h-6 w-0.5 bg-teal-500 dark:bg-teal-600"></div>
              
              <div className="bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-center min-w-32">
                <div className="text-sm font-medium text-teal-800 dark:text-teal-300">
                  {parsedQuery.joins[0].table.name}
                </div>
                {parsedQuery.joins[0].table.alias && (
                  <div className="text-xs text-teal-600 dark:text-teal-400">
                    as {parsedQuery.joins[0].table.alias}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* WHERE condition if applicable */}
          {parsedQuery.where && (
            <div className="flex flex-col items-center">
              <div className="h-6 w-0.5 bg-amber-500 dark:bg-amber-600"></div>
              <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-center max-w-60">
                <div className="text-xs font-medium text-amber-800 dark:text-amber-300">WHERE</div>
                <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 break-words">
                  {parsedQuery.where.condition}
                </div>
              </div>
            </div>
          )}
          
          {/* ORDER BY if applicable */}
          {parsedQuery.orderBy && parsedQuery.orderBy.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="h-6 w-0.5 bg-purple-500 dark:bg-purple-600"></div>
              <div className="bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center">
                <div className="text-xs font-medium text-purple-800 dark:text-purple-300">ORDER BY</div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  {parsedQuery.orderBy.map((order, idx) => (
                    <span key={idx}>
                      {order.column} {order.direction}
                      {idx < parsedQuery.orderBy!.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Result */}
          <div className="flex flex-col items-center">
            <div className="h-6 w-0.5 bg-green-500 dark:bg-green-600"></div>
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
              <div className="text-sm font-medium text-green-800 dark:text-green-300">Results</div>
            </div>
          </div>
        </div>
        
        {/* Icons showing visualization options */}
        <div className="flex justify-center mt-6 space-x-4">
          <button className="btn-secondary flex items-center space-x-2 text-sm">
            <BarChart className="h-4 w-4" />
            <span>Bar Chart</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2 text-sm">
            <LineChart className="h-4 w-4" />
            <span>Line Chart</span>
          </button>
        </div>
      </div>
    );
  }

  // For other query types
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Query Visualization</h2>
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Visualization for {parsedQuery.type} queries coming soon
        </p>
      </div>
    </div>
  );
};

export default VisualizationPanel;