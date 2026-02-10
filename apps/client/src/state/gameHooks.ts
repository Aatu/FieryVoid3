import { useMutation } from "@tanstack/react-query";
import { createGame } from "../api/game";
import GameData from "@fieryvoid3/model/src/game/GameData";

export const useCreateGame = () =>
  useMutation({
    mutationFn: async ({ gameData }: { gameData: GameData }) =>
      createGame(gameData),
  });
