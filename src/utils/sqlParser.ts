import {
  ParsedQuery,
  SqlQueryType,
  TableReference,
  JoinClause,
} from "../types/sql";

/**
 * A simple SQL parser to break down the query into its components
 * Note: This is a simplified parser and doesn't handle all SQL syntax
 */
export function parseQuery(query: string): ParsedQuery {
  // Normalize the query by removing extra whitespace and making it uppercase for easier parsing
  const normalizedQuery = query.trim();
  const upperQuery = normalizedQuery.toUpperCase();

  // Determine the query type
  let type = SqlQueryType.UNKNOWN;
  if (upperQuery.startsWith("SELECT")) type = SqlQueryType.SELECT;
  else if (upperQuery.startsWith("INSERT")) type = SqlQueryType.INSERT;
  else if (upperQuery.startsWith("UPDATE")) type = SqlQueryType.UPDATE;
  else if (upperQuery.startsWith("DELETE")) type = SqlQueryType.DELETE;
  else if (upperQuery.startsWith("CREATE")) type = SqlQueryType.CREATE;
  else if (upperQuery.startsWith("DROP")) type = SqlQueryType.DROP;
  else if (upperQuery.startsWith("ALTER")) type = SqlQueryType.ALTER;

  // Initialize the parsed query
  const parsedQuery: ParsedQuery = {
    type,
    raw: normalizedQuery,
  };

  // For SELECT queries, parse more details
  if (type === SqlQueryType.SELECT) {
    // Extract SELECT clause
    const selectMatch = upperQuery.match(/SELECT\s+(.*?)\s+FROM/i);
    if (selectMatch && selectMatch[1]) {
      const columnsStr = selectMatch[1].trim();
      const isSelectAll = columnsStr === "*";
      const columns = isSelectAll
        ? ["*"]
        : columnsStr.split(",").map((col) => col.trim());

      parsedQuery.select = {
        columns,
        isSelectAll,
      };
    }

    // Extract FROM clause
    const fromMatch = upperQuery.match(
      /FROM\s+(.*?)(?:\s+WHERE|\s+ORDER|\s+LIMIT|\s+GROUP|\s+HAVING|\s*;|\s*$)/i
    );
    if (fromMatch && fromMatch[1]) {
      const fromClause = fromMatch[1].trim();

      // Check for JOINs
      if (fromClause.includes("JOIN")) {
        // This is a simplified JOIN parser
        const tables: TableReference[] = [];
        const joins: JoinClause[] = [];

        // Extract the first table (before any JOIN)
        const mainTableMatch = fromClause.match(
          /^([^\s]+)(?:\s+AS\s+([^\s]+))?/i
        );
        if (mainTableMatch) {
          tables.push({
            name: mainTableMatch[1],
            alias: mainTableMatch[2],
          });
        }

        // Extract JOINs (simplified)
        const joinPattern =
          /(INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\s+([^\s]+)(?:\s+AS\s+([^\s]+))?\s+ON\s+(.*?)(?=\s+(?:INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN|\s*$)/gi;
        let joinMatch;

        while ((joinMatch = joinPattern.exec(fromClause)) !== null) {
          joins.push({
            type: joinMatch[1] ? joinMatch[1].toUpperCase() : "INNER",
            table: {
              name: joinMatch[2],
              alias: joinMatch[3],
            },
            condition: joinMatch[4].trim(),
          });
        }

        parsedQuery.from = tables;
        parsedQuery.joins = joins;
      } else {
        // Simple FROM with one or more tables
        const tables = fromClause.split(",").map((tableStr) => {
          const parts = tableStr.trim().split(/\s+AS\s+|\s+/i);
          return {
            name: parts[0].trim(),
            alias: parts.length > 1 ? parts[1].trim() : undefined,
          };
        });

        parsedQuery.from = tables;
      }
    }

    // Extract WHERE clause
    const whereMatch = upperQuery.match(
      /WHERE\s+(.*?)(?:\s+ORDER|\s+LIMIT|\s+GROUP|\s+HAVING|\s*;|\s*$)/i
    );
    if (whereMatch && whereMatch[1]) {
      parsedQuery.where = {
        condition: whereMatch[1].trim(),
      };
    }

    // Extract ORDER BY clause
    const orderByMatch = upperQuery.match(
      /ORDER\s+BY\s+(.*?)(?:\s+LIMIT|\s+GROUP|\s+HAVING|\s*;|\s*$)/i
    );
    if (orderByMatch && orderByMatch[1]) {
      const orderClauses = orderByMatch[1].split(",").map((clause) => {
        const parts = clause.trim().split(/\s+/);
        return {
          column: parts[0],
          direction: parts.length > 1 && parts[1] === "DESC" ? "DESC" : "ASC",
        };
      });

      parsedQuery.orderBy = orderClauses;
    }

    // Extract LIMIT clause
    const limitMatch = upperQuery.match(/LIMIT\s+(\d+)(?:\s*;|\s*$)/i);
    if (limitMatch && limitMatch[1]) {
      parsedQuery.limit = parseInt(limitMatch[1], 10);
    }
  }

  return parsedQuery;
}
