import { IUser } from "@fieryvoid3/model/src/User/User";
import { api } from "./api";

export const login = (username: string, password: string) =>
  api.post("/login", { username, password });

export const register = (username: string, password: string) =>
  api.post("/register", { username, password });

export const getCurrentUser = (): Promise<IUser | undefined> =>
  api.get("/user");

export const logout = () => api.get("/logout");
