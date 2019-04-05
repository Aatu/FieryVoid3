import axios from "axios";
import { SERVER_URL } from "../config";

const axiosConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
};

export const login = async (username, password) => {
  try {
    return await axios.post(
      `${SERVER_URL}/login`,
      {
        username,
        password
      },
      axiosConfig
    );
  } catch (error) {
    throw error.response;
  }
};

export const register = async (username, password) => {
  try {
    return await axios.post(
      `${SERVER_URL}/register`,
      {
        username,
        password
      },
      axiosConfig
    );
  } catch (error) {
    throw error.response;
  }
};

export const getCurrentUser = async () => {
  try {
    return await axios.get(`${SERVER_URL}/user`, axiosConfig);
  } catch (error) {
    throw error.response;
  }
};

export const logout = async () => {
  try {
    return await axios.get(`${SERVER_URL}/logout`, axiosConfig);
  } catch (error) {
    throw error.response;
  }
};
