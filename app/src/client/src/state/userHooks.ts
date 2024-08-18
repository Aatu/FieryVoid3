import { useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentUser, login, logout, register } from "../api/user";
import { User } from "@fieryvoid3/model";

export const useUser = () =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const userData = await getCurrentUser();

      return userData ? new User(userData) : null;
    },
  });

export const useLoginUser = () =>
  useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => login(username, password),
  });

export const useRegisterUser = () =>
  useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => register(username, password),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: async () => logout(),
  });
