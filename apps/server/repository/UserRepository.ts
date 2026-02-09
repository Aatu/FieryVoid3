import { IUser, User } from "../../model/src/User/User";
import DbConnection from "./DbConnection";

class UserRepository {
  private db: DbConnection;

  constructor(db: DbConnection) {
    this.db = db;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const data = await this.db.query<IUser>(
      null,
      "select id, username, access_level as accessLevel from user where username = ?",
      [username]
    );

    return data[0] ? new User(data[0]) : null;
  }

  async getUserById(id: number) {
    const data = await this.db.query<IUser>(
      null,
      "select id, username, access_level as accessLevel from user where id = ?",
      [id]
    );

    return data[0] ? new User(data[0]) : null;
  }

  async checkPassword(
    username: string,
    password: string
  ): Promise<User | null> {
    const data = await this.db.query<IUser>(
      null,
      "select  id, username, access_level as accessLevel from user where username = ? and password = PASSWORD( ? )",
      [username, password + "molecular-pulsar"]
    );

    return data[0] ? new User(data[0]) : null;
  }

  async insertUser(username: string, password: string): Promise<boolean> {
    const data = await this.db.query(
      null,
      "insert into user (username, password) values (?, PASSWORD( ? ))",
      [username, password + "molecular-pulsar"]
    );
    return Boolean(data);
  }
}

export default UserRepository;
