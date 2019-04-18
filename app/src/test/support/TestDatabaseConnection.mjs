import DbConnection from "../../server/repository/DbConnection";
import createDatabase from "./createDatabase";

class TestDbConnection extends DbConnection {
  constructor() {
    super({
      host: "localhost",
      user: "root",
      password: "root",
      database: "fieryvoidtest",
      connectionLimit: 5
    });

    this.createPool = this.createPool({
      host: "localhost",
      user: "root",
      password: "root",
      connectionLimit: 5,
      multipleStatements: true
    });
  }

  async getCreateConnection() {
    try {
      return await this.createPool.getConnection();
    } catch (err) {
      throw err;
    }
  }

  async resetDatabase() {
    const conn = await this.getCreateConnection();
    await this.query(conn, createDatabase);
  }
}

export default TestDbConnection;
