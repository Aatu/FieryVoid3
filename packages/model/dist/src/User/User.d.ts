export type IUser = {
    id: number;
    username: string;
    accessLevel?: number;
};
export declare class User implements IUser {
    id: number;
    username: string;
    accessLevel: number;
    constructor(data: IUser);
    static create(id: number, username: string): User;
    isAi(): boolean;
    serialize(): IUser;
    deserialize(data: IUser): this;
}
export declare const isUserRegisterData: (data: any) => data is {
    username: string;
    password: string;
};
