import React from 'react';
import { useSqlStore } from '../store/sqlStore';
import { SqlQueryType } from '../types/sql';
import { HelpCircle, AlertTriangle } from 'lucide-react';

const ExplanationPanel: React.FC = () => {
  const { parsedQuery } = useSqlStore();

  if (!parsedQuery) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Query Explanation</h2>
        <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
            <p className="text-gray-500 dark:text-gray-400">Execute a query to see its explanation</p>
          </div>
        </div>
      </div>
    );
  }

  // For SELECT queries
  if (parsedQuery.type === SqlQueryType.SELECT) {
    // Get optimization suggestions
    const suggestions = getOptimizationSuggestions(parsedQuery);
    
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Query Explanation</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">What this query does:</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {getQueryExplanation(parsedQuery)}
            </p>
          </div>
          
          {parsedQuery.joins && parsedQuery.joins.length > 0 && (
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-100 dark:border-teal-800">
              <h3 className="font-medium text-teal-800 dark:text-teal-300 mb-2">About the JOIN:</h3>
              <p className="text-sm text-teal-700 dark:text-teal-400">
                {getJoinExplanation(parsedQuery.joins[0])}
              </p>
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-100 dark:border-amber-800">
              <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Optimization suggestions:
              </h3>
              <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-400 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // For other query types
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Query Explanation</h2>
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Explanation for {parsedQuery.type} queries coming soon
        </p>
      </div>
    </div>
  );
};

// Helper functions to generate explanations
function getQueryExplanation(parsedQuery: any): string {
  if (parsedQuery.type === SqlQueryType.SELECT) {
    let explanation = `This query selects `;
    
    if (parsedQuery.select?.isSelectAll) {
      explanation += `all columns (*)`;
    } else {
      explanation += `specific columns (${parsedQuery.select?.columns.join(', ')})`;
    }
    
    if (parsedQuery.from && parsedQuery.from.length > 0) {
      explanation += ` from the ${parsedQuery.from[0].name} table`;
      
      if (parsedQuery.from[0].alias) {
        explanation += ` (aliased as ${parsedQuery.from[0].alias})`;
      }
    }
    
    if (parsedQuery.joins && parsedQuery.joins.length > 0) {
      explanation += ` and joins with the ${parsedQuery.joins[0].table.name} table`;
    }
    
    if (parsedQuery.where) {
      explanation += ` where ${parsedQuery.where.condition}`;
    }
    
    if (parsedQuery.orderBy && parsedQuery.orderBy.length > 0) {
      explanation += ` ordered by ${parsedQuery.orderBy.map(order => 
        `${order.column} ${order.direction.toLowerCase()}`).join(', ')}`;
    }
    
    if (parsedQuery.limit) {
      explanation += ` with a limit of ${parsedQuery.limit} rows`;
    }
    
    explanation += '.';
    return explanation;
  }
  
  return 'This query type is not fully supported for detailed explanation yet.';
}

function getJoinExplanation(join: any): string {
  const joinTypes: Record<string, string> = {
    'INNER': 'returns rows when there is a match in both tables',
    'LEFT': 'returns all rows from the left table, and the matched rows from the right table',
    'RIGHT': 'returns all rows from the right table, and the matched rows from the left table',
    'FULL': 'returns rows when there is a match in one of the tables',
    'CROSS': 'returns the Cartesian product of the two tables'
  };
  
  let explanation = `This is a${join.type.startsWith('I') ? 'n' : ''} ${join.type} JOIN, which ${joinTypes[join.type] || 'joins tables based on a related column'}.`;
  
  if (join.condition) {
    explanation += ` The join condition is: ${join.condition}.`;
  }
  
  return explanation;
}

function getOptimizationSuggestions(parsedQuery: any): string[] {
  const suggestions: string[] = [];
  
  if (parsedQuery.select?.isSelectAll) {
    suggestions.push('Consider selecting only the columns you need instead of using SELECT *.');
  }
  
  if (parsedQuery.where && parsedQuery.where.condition.includes('LIKE')) {
    suggestions.push('Using LIKE with a leading wildcard (e.g., LIKE "%text") prevents index usage.');
  }
  
  if (!parsedQuery.where && parsedQuery.from && parsedQuery.from.length > 0) {
    suggestions.push('Consider adding a WHERE clause to filter results and improve performance.');
  }
  
  return suggestions;
}

export default ExplanationPanel;