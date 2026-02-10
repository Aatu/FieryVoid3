import { useEffect, useMemo, useState } from "react";
import { useGameData } from "./useGameData";
import { useUser } from "./userHooks";
import { useUiStateHandler } from "./useUIStateHandler";
import { useShip } from "./useShip";
import ShipObject from "../view/game/renderer/ships/ShipObject";

export type ShipBasicState = {
  isMine: boolean;
  icon: ShipObject;
  incomingTorpedos: number;
  shipName: string;
  validPower: boolean;
  isSelected: boolean;
};

export const useShipsBasicState = (shipId: string): ShipBasicState | null => {
  const gameData = useGameData();
  const { data: currentUser } = useUser();
  const uiState = useUiStateHandler();
  const ship = useShip(shipId);

  const selectedShipId = uiState.getSelectedShip()?.id;

  const state: ShipBasicState | null = useMemo(() => {
    if (!ship) {
      return null;
    }

    const isMine = ship.player.is(currentUser || null);
    const { shipIconContainer } = uiState.getServices();
    const icon = shipIconContainer.getByShip(ship);
    const shipName = ship.name || "";

    const incomingTorpedos = gameData.torpedos
      .getTorpedoFlights()
      .filter((flight) => flight.targetId === ship.id).length;

    const validPower = ship.systems.power.isValidPower();

    const isSelected = selectedShipId === ship.id;

    return {
      isMine,
      icon,
      incomingTorpedos,
      shipName,
      validPower,
      isSelected,
    };
  }, [ship, currentUser, uiState, gameData.torpedos, selectedShipId]);

  const [finalState, setFinalState] = useState<ShipBasicState | null>(state);

  useEffect(() => {
    if (!state) {
      if (finalState) {
        setFinalState(null);
      }

      return;
    }

    if (!finalState) {
      setFinalState(state);
      return;
    }

    if (
      state.incomingTorpedos !== finalState.incomingTorpedos ||
      state.validPower !== finalState.validPower ||
      state.isSelected !== finalState.isSelected
    ) {
      setFinalState(state);
    }
  }, [finalState, state]);

  return finalState;
};
