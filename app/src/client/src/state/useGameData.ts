import GameData from "@fieryvoid3/model/src/game/GameData";
import { useUiStateHandler } from "./useUIStateHandler";
import { useEffect, useState } from "react";

export const useGameData = (): GameData => {
  const uiState = useUiStateHandler();
  const [gameData, setGameData] = useState<GameData>(uiState.getGameData());

  useEffect(() => {
    const callback = (newGameData: GameData) => {
      setGameData(newGameData);
    };

    uiState.subscribeToGameDataInstance(callback);

    return () => {
      uiState.unsubscribeFromGameDataInstance(callback);
    };
  }, [uiState]);

  return gameData;
};
