export enum SqlQueryType {
  SELECT = "SELECT",
  INSERT = "INSERT",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  CREATE = "CREATE",
  DROP = "DROP",
  ALTER = "ALTER",
  UNKNOWN = "UNKNOWN",
}

export interface TableReference {
  name: string;
  alias?: string;
}

export interface JoinClause {
  type: "INNER" | "LEFT" | "RIGHT" | "FULL" | "CROSS" | string;
  table: TableReference;
  condition?: string;
}

export interface WhereClause {
  condition: string;
}

export interface SelectClause {
  columns: string[];
  isSelectAll: boolean;
}

export interface OrderByClause {
  column: string;
  direction: "ASC" | "DESC";
}

export interface ParsedQuery {
  type: SqlQueryType;
  select?: SelectClause;
  from?: TableReference[];
  joins?: JoinClause[];
  where?: WhereClause;
  orderBy?: OrderByClause[];
  limit?: number;
  raw: string;
}
