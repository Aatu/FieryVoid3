import { useUiStateHandler } from "./useUIStateHandler";
import { useEffect, useState } from "react";
import { useGameData } from "./useGameData";
import Ship from "@fieryvoid3/model/src/unit/Ship";

export const useShip = (shipId: string): Ship => {
  const uiState = useUiStateHandler();
  const gameData = useGameData();

  const [ship, setShip] = useState<Ship>(gameData.ships.getShipById(shipId));

  useEffect(() => {
    const callback = (newShip: Ship) => {
      if (newShip.id === shipId) {
        setShip(gameData.ships.getShipById(shipId));
      }
    };

    uiState.subscribeToSystemChange(callback);

    return () => {
      uiState.unsubscribeFromSystemChange(callback);
    };
  }, [uiState, gameData, shipId]);

  return ship;
};
