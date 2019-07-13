import Yup from "yup";
import { InvalidRequestError } from "../errors/index.mjs";

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getUserByUsername(username) {
    return this.userRepository.getUserByUsername(username);
  }

  getUserById(id) {
    return this.userRepository.getUserByUsername(id);
  }

  checkPassword(username, password) {
    return this.userRepository.checkPassword(username, password);
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

    return this.userRepository.insertUser(username, password);
  }
}

export default UserService;
