// @ts-expect-error does not have types
import mariadb from "mariadb";

type Connection = {
  query: <T>(query: string, payload: (string | number)[]) => Promise<T[]>;
  end: () => Promise<void>;
};

class DbConnection {
  private pool: any;

  constructor(config) {
    this.pool = this.createPool(config);
  }

  private createPool(config) {
    return mariadb.createPool(config);
  }

  async getConnection(): Promise<Connection> {
    try {
      return await this.pool.getConnection();
    } catch (err) {
      throw err;
    }
  }

  async query<T>(
    conn: Connection | null,
    query: string,
    payload: (string | number)[] = []
  ): Promise<T[]> {
    let response = null;
    try {
      if (!conn) {
        conn = await this.getConnection();
      }
      response = await conn.query<T>(query, payload);
      return response;
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
