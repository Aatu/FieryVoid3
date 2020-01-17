import User from "../User.mjs";

class ShipPlayer {
  constructor() {
    this.user = null;
  }

  is(user) {
    return user && this.user.id === user.id;
  }

  setUser(user) {
    this.user = user;
  }

  isUsers(user) {
    return user && this.user && this.user.id === user.id;
  }

  deserialize(user) {
    this.user = user ? new User().deserialize(user) : undefined;

    return this;
  }

  serialize() {
    return this.user ? this.user.serialize() : undefined;
  }
}

export default ShipPlayer;
