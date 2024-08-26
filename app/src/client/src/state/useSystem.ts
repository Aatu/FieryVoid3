import { useUiStateHandler } from "./useUIStateHandler";
import { useEffect, useState } from "react";
import { useGameData } from "./useGameData";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";

export const useSystem = (shipId: string, systemId: number): ShipSystem => {
  const uiState = useUiStateHandler();
  const gameData = useGameData();

  const [system, setSystem] = useState<ShipSystem>(
    gameData.ships.getShipById(shipId).systems.getSystemById(systemId)
  );

  useEffect(() => {
    const callback = (newShip: Ship, newSystem: ShipSystem) => {
      if (newShip.id === shipId && newSystem.id === systemId) {
        setSystem(
          gameData.ships.getShipById(shipId).systems.getSystemById(systemId)
        );
      }
    };

    uiState.subscribeToSystemChange(callback);

    return () => {
      uiState.unsubscribeFromSystemChange(callback);
    };
  }, [uiState, gameData, shipId, systemId]);

  return system;
};
