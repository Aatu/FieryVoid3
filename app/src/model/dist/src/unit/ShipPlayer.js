import { User } from "../User/User";
class ShipPlayer {
    user;
    constructor() {
        this.user = null;
    }
    isAi() {
        return this.user && this.user.isAi();
    }
    is(user) {
        return Boolean(user && this.user?.id === user.id);
    }
    getUser() {
        if (!this.user) {
            throw new Error("Player has no user");
        }
        return this.user;
    }
    setUser(user) {
        this.user = user;
    }
    isUsers(user) {
        return Boolean(user && this.user && this.user.id === user.id);
    }
    deserialize(user) {
        this.user = user ? new User(user) : null;
        return this;
    }
    serialize() {
        return this.user ? this.user.serialize() : null;
    }
}
export default ShipPlayer;
