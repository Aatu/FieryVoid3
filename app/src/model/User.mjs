class User {
  constructor(id, username, accessLevel = 1) {
    this.id = id;
    this.username = username;
    this.accessLevel = accessLevel;
  }

  isAi() {
    return this.id < 0;
  }

  serialize() {
    return {
      id: this.id,
      username: this.username,
      accessLevel: this.accessLevel,
    };
  }

  deserialize(data) {
    this.id = data.id;
    this.username = data.username;
    this.accessLevel = data.accessLevel;

    return this;
  }
}

export default User;
