import axios from "axios";
import { SERVER_URL } from "../config";

const axiosConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
};

export const createGame = async gameData => {
  try {
    console.log("what");
    return axios.post(`${SERVER_URL}/game`, gameData.serialize(), axiosConfig);
  } catch (error) {
    throw error.response;
  }
};
