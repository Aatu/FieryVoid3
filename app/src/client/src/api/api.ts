import axios, { isAxiosError } from "axios";
import { SERVER_URL } from "../config";

const axiosConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const post = async <T>(url: string, payload: unknown): Promise<T> => {
  try {
    return await axios.post(`${SERVER_URL}${url}`, payload, axiosConfig);
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response;
    }

    throw error;
  }
};

const get = async <T>(url: string): Promise<T> => {
  try {
    return await axios.get(`${SERVER_URL}${url}`, axiosConfig);
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response;
    }

    throw error;
  }
};

export const api = {
  post,
  get,
};
