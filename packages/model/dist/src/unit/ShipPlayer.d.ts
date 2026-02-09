import { IUser, User } from "../User/User";
declare class ShipPlayer {
    user: User | null;
    constructor();
    isAi(): boolean | null;
    is(user: User | null): boolean;
    getUser(): User;
    setUser(user: User): void;
    isUsers(user: User | null): boolean;
    deserialize(user: IUser): this;
    serialize(): IUser | null;
}
export default ShipPlayer;
