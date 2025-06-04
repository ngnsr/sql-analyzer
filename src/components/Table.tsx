import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TableProps {
  columns: string[];
  data: any[][];
}

export const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                  >
                    {cell === null ? <span className="text-gray-400 dark:text-gray-500">NULL</span> : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface TableEmptyProps {
  message: string;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({ message }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center text-center">
      <AlertCircle className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
};