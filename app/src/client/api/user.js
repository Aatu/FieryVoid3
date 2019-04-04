import axios from "axios";
import { SERVER_URL } from "../config";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${SERVER_URL}/login`, {
      username,
      password
    });
    console.log(response);
  } catch (error) {
    console.log("login error", error);
  }

  console.log("api login", username, password);
};
