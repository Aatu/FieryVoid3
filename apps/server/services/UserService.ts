import { InvalidRequestError } from "../errors";
import { isUserRegisterData, User } from "../../model/src/User/User";
import UserRepository from "../repository/UserRepository";

class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.getUserByUsername(username);
  }

  getUserById(id: number): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }

  checkPassword(username: string, password: string): Promise<User | null> {
    return this.userRepository.checkPassword(username, password);
  }

  async register(data: unknown): Promise<boolean> {
    if (!isUserRegisterData(data)) {
      throw new InvalidRequestError();
    }

    const { username, password } = data;

    if (await this.getUserByUsername(username)) {
      return false;
    }

    return this.userRepository.insertUser(username, password);
  }
}

export default UserService;
