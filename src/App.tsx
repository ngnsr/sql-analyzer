import { useEffect, useState, useRef } from 'react';
import Header from './components/Header';
import SqlEditor from './components/SqlEditor';
import ResultsPanel from './components/ResultsPanel';
import VisualizationPanel from './components/VisualizationPanel';
import ExplanationPanel from './components/ExplanationPanel';
import initSqlJs from 'sql.js';
import { useSqlStore } from './store/sqlStore';
import LoadingSpinner from './components/LoadingSpinner';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';

function App() {
  const [loading, setLoading] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null); // Track file name
  const { theme } = useTheme();
  const { initializeDatabase } = useSqlStore();
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for hidden input

  const loadDatabase = async (file?: File) => {
    try {
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`,
      });
      let db;
      if (file) {
        if (file.name.endsWith('.sql')) {
          db = new SQL.Database();
          const fileText = await file.text();
          db.run(fileText);
        } else if (file.name.endsWith('.sqlite') || file.name.endsWith('.db')) {
          const fileBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(fileBuffer);
          db = new SQL.Database(uint8Array);
        } else {
          throw new Error('Unsupported file type');
        }
      } else {
        db = new SQL.Database();
        db.run(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at TEXT
          );
          
          INSERT INTO users VALUES 
            (1, 'John Doe', 'john@example.com', '2023-01-15'),
            (2, 'Jane Smith', 'jane@example.com', '2023-02-20'),
            (3, 'Bob Johnson', 'bob@example.com', '2023-03-10'),
            (4, 'Alice Brown', 'alice@example.com', '2023-04-05'),
            (5, 'Charlie Davis', 'charlie@example.com', '2023-05-12');
            
          CREATE TABLE orders (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            product TEXT NOT NULL,
            amount REAL NOT NULL,
            order_date TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
          );
          
          INSERT INTO orders VALUES
            (101, 1, 'Laptop', 1299.99, '2023-02-01'),
            (102, 2, 'Phone', 799.99, '2023-03-15'),
            (103, 1, 'Headphones', 149.99, '2023-02-10'),
            (104, 3, 'Monitor', 349.99, '2023-04-20'),
            (105, 2, 'Tablet', 499.99, '2023-05-01'),
            (106, 4, 'Keyboard', 79.99, '2023-04-15'),
            (107, 5, 'Mouse', 49.99, '2023-05-20'),
            (108, 1, 'Docking Station', 199.99, '2023-03-01');
        `);
      }
      const testResult = db.exec('SELECT * FROM users');
      console.log('Test query result:', testResult);
      initializeDatabase(db);
      setLoading(false);
      setFileError(null);
    } catch (error) {
      console.error('Failed to load SQL.js:', error);
      setFileError(error instanceof Error ? error.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, [initializeDatabase]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileError('No file selected');
      return;
    }
    setSelectedFileName(file.name); // Update file name
    setLoading(true);
    loadDatabase(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Trigger file input
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header>
        <ThemeToggle />
      </Header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Upload SQL or SQLite File
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".sql,.sqlite,.db"
              onChange={handleFileUpload}
              className="hidden" // Hide default input
              ref={fileInputRef}
            />
            <button
              onClick={handleButtonClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              Choose File
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
              {selectedFileName || 'No file selected'}
            </span>
          </div>
          {fileError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {fileError}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SqlEditor />
            <ResultsPanel />
          </div>

          <div className="space-y-6">
            <VisualizationPanel />
            <ExplanationPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;