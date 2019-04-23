import User from "../../model/User";

class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async getUserByUsername(username) {
    const data = await this.db.query(
      null,
      "select id, username, access_level as accessLevel from user where username = ?",
      [username]
    );
    return data[0] ? new User().deserialize(data[0]) : null;
  }

  async getUserById(id) {
    const data = await this.db.query(
      null,
      "select id, username, access_level as accessLevel from user where id = ?",
      [id]
    );
    return data[0] ? new User().deserialize(data[0]) : null;
  }

  async checkPassword(username, password) {
    const data = await this.db.query(
      null,
      "select * from user where username = ? and password = PASSWORD( ? )",
      [username, password + "molecular-pulsar"]
    );
    return Boolean(data);
  }

  async insertUser(username, password) {
    const data = await this.db.query(
      null,
      "insert into user (username, password) values (?, PASSWORD( ? ))",
      [username, password + "molecular-pulsar"]
    );
    return Boolean(data);
  }
}

export default UserRepository;
