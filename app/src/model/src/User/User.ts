import yup from "yup";

export type IUser = {
  id: number;
  username: string;
  accessLevel?: number;
};

export class User implements IUser {
  public id!: number;
  public username!: string;
  public accessLevel!: number;

  constructor(data: IUser) {
    this.deserialize(data);
  }
  public static create(id: number, username: string): User {
    return new User({ id, username });
  }

  isAi(): boolean {
    return this.id < 0;
  }

  serialize(): IUser {
    return {
      id: this.id,
      username: this.username,
      accessLevel: this.accessLevel,
    };
  }

  deserialize(data: IUser) {
    this.id = data.id;
    this.username = data.username;
    this.accessLevel = data.accessLevel || 1;

    return this;
  }
}

export const isUserRegisterData = (
  data: any
): data is { username: string; password: string } => {
  const schema = yup.object().shape({
    username: yup.string().min(2).required(),
    password: yup.string().min(2).required(),
  });

  return schema.isValidSync(data);
};
