import GameData from "@fieryvoid3/model/src/game/GameData";
import { UIStateContext } from "../view/game/GameStoreProvider";
import { useContextSelector } from "use-context-selector";

export const useGameData = (): GameData => {
  const state = useContextSelector(UIStateContext, (state) => state.gameData);

  return state;
};
