// // types/sql.d.ts
// import { QueryExecResult } from "sql.js";

// interface LazyHttpDatabase {
//   exec: (sql: string) => Promise<QueryExecResult[]>;
//   // Add other methods if needed
// }

// type Remote<T> = T; // Simplified: assume Remote just passes through the type

// declare module "sql.js-httpvfs" {
//   export function createDbWorker(
//     configs: Array<{ from: string; config: any }>,
//     workerUrl: string,
//     wasmUrl: string
//   ): Promise<Remote<LazyHttpDatabase>>;
// }
