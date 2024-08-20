import { IUser, User } from "../User/User";

class ShipPlayer {
  public user: User | null;

  constructor() {
    this.user = null;
  }

  isAi() {
    return this.user && this.user.isAi();
  }

  is(user: User | null) {
    return user && this.user?.id === user.id;
  }

  getUser(): User {
    if (!this.user) {
      throw new Error("Player has no user");
    }

    return this.user;
  }

  setUser(user: User) {
    this.user = user;
  }

  isUsers(user: User) {
    return user && this.user && this.user.id === user.id;
  }

  deserialize(user: IUser) {
    this.user = user ? new User(user) : null;

    return this;
  }

  serialize() {
    return this.user ? this.user.serialize() : null;
  }
}

export default ShipPlayer;
