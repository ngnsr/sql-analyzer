import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-sql';
import { Play, XCircle } from 'lucide-react';
import { useSqlStore } from '../store/sqlStore';

const SqlEditor: React.FC = () => {
  const { currentQuery, setCurrentQuery, executeQuery, error, isLoading } = useSqlStore();

  const handleExecute = () => {
    executeQuery();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Execute query on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">SQL Query</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Press Ctrl+Enter to run
        </div>
      </div>
      
      <div 
        className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mb-4"
        onKeyDown={handleKeyDown}
      >
        <Editor
          value={currentQuery}
          onValueChange={code => setCurrentQuery(code)}
          highlight={code => highlight(code, languages.sql, 'sql')}
          padding={16}
          className="sql-editor"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            minHeight: '200px',
          }}
        />
      </div>
      
      {error && (
        <div className="flex items-start space-x-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-red-800 dark:text-red-300">
          <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button 
          onClick={handleExecute}
          disabled={isLoading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="h-4 w-4" />
          <span>Execute Query</span>
        </button>
      </div>
    </div>
  );
};

export default SqlEditor;