import { create } from "zustand";
import { QueryExecResult } from "sql.js";
import { ParsedQuery } from "../types/sql";
import { parseQuery } from "../utils/sqlParser";
import { Database } from "sql.js";

interface SqlState {
  db: Database | null;
  currentQuery: string;
  queryResults: QueryExecResult[] | null;
  parsedQuery: ParsedQuery | null;
  error: string | null;
  isLoading: boolean;

  initializeDatabase: (db: Database) => void;
  setCurrentQuery: (query: string) => void;
  executeQuery: () => Promise<void>;
}

export const useSqlStore = create<SqlState>((set, get) => ({
  db: null,
  currentQuery: `-- Let's explore the users and their orders!
SELECT 
  u.name,
  COUNT(o.id) as order_count,
  SUM(o.amount) as total_spent,
  MAX(o.order_date) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY total_spent DESC;`,
  queryResults: null,
  parsedQuery: null,
  error: null,
  isLoading: false,

  initializeDatabase: (db: Database) => {
    set({ db });
    setTimeout(() => get().executeQuery(), 0);
  },

  setCurrentQuery: (query: string) => {
    set({ currentQuery: query });
  },

  executeQuery: async () => {
    const { db, currentQuery } = get();

    if (!db) {
      set({ error: "Database not initialized" });
      return;
    }

    if (!currentQuery.trim()) {
      set({ error: "Please enter a SQL query" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const parsedQuery = parseQuery(currentQuery);
      const results = db.exec(currentQuery); // sql.js exec is synchronous
      set({
        queryResults: results,
        parsedQuery,
        error: null,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
        queryResults: null,
        parsedQuery: null,
        isLoading: false,
      });
    }
  },
}));
