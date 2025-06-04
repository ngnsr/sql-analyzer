import React, { ReactNode } from 'react';
import { Database } from 'lucide-react';

interface HeaderProps {
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">SQL Visual Explainer</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;