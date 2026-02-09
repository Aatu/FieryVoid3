import * as yup from "yup";
export class User {
    id;
    username;
    accessLevel;
    constructor(data) {
        this.deserialize(data);
    }
    static create(id, username) {
        return new User({ id, username });
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
        this.accessLevel = data.accessLevel || 1;
        return this;
    }
}
export const isUserRegisterData = (data) => {
    const schema = yup.object().shape({
        username: yup.string().min(2).required(),
        password: yup.string().min(2).required(),
    });
    return schema.isValidSync(data);
};
