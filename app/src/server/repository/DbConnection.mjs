import mariadb from "mariadb";

class DbConnection {
  constructor(config) {
    this.pool = this.createPool(config);
  }

  createPool(config) {
    return mariadb.createPool(config);
  }

  async getConnection() {
    try {
      return await this.pool.getConnection();
    } catch (err) {
      throw err;
    }
  }

  async query(conn, query, payload = []) {
    try {
      if (!conn) {
        conn = await this.getConnection();
      }
      const response = await conn.query(query, payload);
      return response;
    } catch (err) {
      if (conn) {
        await conn.end();
      }
      throw err;
    }
  }
}

export default DbConnection;
