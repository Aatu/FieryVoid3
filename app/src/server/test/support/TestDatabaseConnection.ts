import DbConnection from "../../repository/DbConnection";
import createDatabase from "./createDatabase";
import mariadb from "mariadb";

class TestDbConnection extends DbConnection {
  public dbName: string;
  private poolForCreatingDatabase: mariadb.Pool;

  constructor(dbName: string) {
    super({
      host: "localhost",
      user: "root",
      password: "root",
      database: `fieryvoidtest_${dbName}`,
      connectionLimit: 5,
      multipleStatements: true,
      trace: true,
    });

    this.dbName = dbName;

    this.poolForCreatingDatabase = this.createPool({
      host: "localhost",
      user: "root",
      password: "root",
      connectionLimit: 5,
      multipleStatements: true,
      trace: true,
    });
  }

  async getCreateConnection() {
    try {
      return await this.poolForCreatingDatabase.getConnection();
    } catch (err) {
      throw err;
    }
  }

  async resetDatabase() {
    const conn = await this.getCreateConnection();
    await this.query(conn, createDatabase(this.dbName));
    await conn.end();
    await this.poolForCreatingDatabase.end();
  }
}

export default TestDbConnection;
