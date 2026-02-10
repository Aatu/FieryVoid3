import { useUiStateHandler } from "./useUIStateHandler";
import { useEffect, useState } from "react";
import { useGameData } from "./useGameData";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { useGameStore } from "../view/game/GameStoreProvider";

export const useShip = (shipId?: string): Ship | null => {
  const uiState = useUiStateHandler();
  const gameData = useGameData();

  const [ship, setShip] = useState<Ship | null>(
    shipId ? gameData.ships.getShipById(shipId) : null
  );

  if (!shipId) {
    console.log("no ship id");
  }

  if (!ship) {
    console.log("no ship", shipId);
  }

  useEffect(() => {
    if (!shipId || ship?.id === shipId) {
      return;
    }

    const newShip = gameData.ships.getShipById(shipId);

    setShip(newShip);
  }, [gameData, ship, shipId]);

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

export const useSelectedShip = (): Ship | null => {
  const selectedShipId = useGameStore(
    (state) => state.gameState.selectedShipId
  );

  console.log("useSelectedShip", selectedShipId);

  return useShip(selectedShipId || undefined);
};
