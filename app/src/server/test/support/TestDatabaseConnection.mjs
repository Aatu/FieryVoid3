import DbConnection from "../../server/repository/DbConnection";
import createDatabase from "./createDatabase";

class TestDbConnection extends DbConnection {
  constructor(dbName) {
    super({
      host: "localhost",
      user: "root",
      password: "root",
      database: `fieryvoidtest_${dbName}`,
      connectionLimit: 5
    });

    this.dbName = dbName;

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
    await this.query(conn, createDatabase(this.dbName));
    await conn.end();
    await this.createPool.end();
  }
}

export default TestDbConnection;
