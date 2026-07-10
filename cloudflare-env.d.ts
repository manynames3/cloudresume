interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

type D1Meta = Record<string, unknown>;

interface D1Result<T = unknown> {
  success: true;
  meta: D1Meta;
  results: T[];
  error?: never;
}

interface D1ExecResult {
  count: number;
  duration: number;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(columnName: string): Promise<T | null>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  raw<T = unknown[]>(options: { columnNames: true }): Promise<[string[], ...T[]]>;
  raw<T = unknown[]>(options?: { columnNames?: false }): Promise<T[]>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
  dump(): Promise<ArrayBuffer>;
}

declare module "cloudflare:workers" {
  export const env: {
    DB?: D1Database;
  };
}
