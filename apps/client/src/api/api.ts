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
    const response = await axios.post<T>(
      `${SERVER_URL}${url}`,
      payload,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response;
    }

    throw error;
  }
};

const get = async <T>(url: string): Promise<T> => {
  try {
    const response = await axios.get<T>(`${SERVER_URL}${url}`, axiosConfig);
    return response.data;
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
