import mariadb from "mariadb";

/*
export type Connection = {
  query: <T>(
    query: string,
    payload: (string | number | null | Record<string, unknown>)[]
  ) => Promise<T[]>;
  end: () => Promise<void>;
  batch: (
    query: string,
    payload: (string | number | null | Record<string, unknown>)[][]
  ) => Promise<unknown>;
  beginTransaction: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
};
*/

type Config = {
  host: string;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
};

class DbConnection {
  private pool: mariadb.Pool;

  constructor(config: Config) {
    this.pool = this.createPool(config);
  }

  private createPool(config: Config) {
    return mariadb.createPool(config);
  }

  async getConnection(): Promise<mariadb.PoolConnection> {
    try {
      return await this.pool.getConnection();
    } catch (err) {
      throw err;
    }
  }

  async insert<T extends number | string = number>(
    conn: mariadb.PoolConnection | null,
    query: string,
    payload: (string | number | null)[] = []
  ): Promise<T> {
    const response = await this.query(conn, query, payload);
    return (response as unknown as { insertId: T }).insertId;
  }

  async query<T>(
    conn: mariadb.PoolConnection | null,
    query: string,
    payload: (string | number | null | Record<string, unknown>)[] = []
  ): Promise<T[]> {
    let response = null;
    try {
      if (!conn) {
        conn = await this.getConnection();
      }
      response = await conn.query(query, payload);
      return response as T[];
    } catch (err) {
      if (conn) {
        await conn.end();
      }
      throw err;
    }
  }

  async close() {
    await this.pool.end();
  }
}

export default DbConnection;
