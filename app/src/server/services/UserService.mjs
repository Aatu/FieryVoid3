import * as userRepository from "../repository/userRepository";
import Yup from "yup";
import { InvalidRequestError } from "../errors";

class UserService {
  constructor() {}

  getUserByUsername(username) {
    return userRepository.getUserByUsername(username);
  }

  getUserById(id) {
    return userRepository.getUserByUsername(id);
  }

  checkPassword(username, password) {
    return userRepository.checkPassword(username, password);
  }

  async register(data) {
    const schema = Yup.object().shape({
      username: Yup.string()
        .min(2)
        .required(),
      password: Yup.string()
        .min(2)
        .required()
    });

    const valid = await schema.isValid(data);

    if (!valid) {
      throw new InvalidRequestError();
    }

    const { username, password } = data;

    if (await this.getUserByUsername(username)) {
      return false;
    }

    return userRepository.insertUser(username, password);
  }
}

export default UserService;
