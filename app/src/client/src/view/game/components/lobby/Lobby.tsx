import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { useUser } from "../../../../state/userHooks";
import GameData from "@fieryvoid3/model/src/game/GameData";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { createShipInstance } from "@fieryvoid3/model/src/unit/createShipObject";
import GameSlot from "@fieryvoid3/model/src/game/GameSlot";
import UIState from "../../ui/UIState";
import { TooltipContainer, TooltipHeader } from "../../../../styled";
import Game from "../../Game";
import FleetStore from "./FleetStore";

const LobbyContainer = styled.div`
  display: flex;
  position: absolute;
  top: 5px;
  max-height: calc(100vh - 40px);
  left: calc(50vw - 400px);
  right: 5px;
  bottom: 5px;
  z-index: 3;
`;

const ContainerLeft = styled.div`
  width: 50%;
  min-width: 800px;
  margin: 5px;
  z-index: 3;
`;

const ContainerRight = styled.div`
  width: 50%;
  min-width: 200px;
  margin: 5px;
  z-index: 3;
`;

const Lobby: React.FC<{
  game: Game;
  gameData: GameData;
  uiState: UIState;
}> = ({ gameData, uiState, game }) => {
  const { data: currentUser } = useUser();
  const [shipsToBuy, setShipsToBuy] = useState<Ship[]>([]);

  const { selectedSlot, ships } = useMemo((): {
    selectedSlot: GameSlot | null;
    ships: Ship[];
  } => {
    if (!gameData || !currentUser) {
      return { selectedSlot: null, ships: [] };
    }

    const selectedSlot =
      gameData.slots
        .getSlots()
        .find((slot) => slot.isOccupiedBy(currentUser)) || null;

    const ships = selectedSlot ? selectedSlot.getShips() : [];
    return {
      selectedSlot,
      ships,
    };
  }, [currentUser, gameData]);

  const buyShip = useCallback(
    (shipClass: string) => {
      const ship = createShipInstance(shipClass);

      if (!selectedSlot) {
        return;
      }

      const totalCost = [...ships, ship].reduce(
        (acc, ship) => acc + ship.getPointCost(),
        0
      );

      if (totalCost > selectedSlot.points) {
        alert("Too costly");
        return;
      }

      setShipsToBuy([...shipsToBuy, ship]);
    },
    [selectedSlot, ships, shipsToBuy]
  );

  const onReady = useCallback(() => {
    uiState.customEvent("buyShips", { slot: selectedSlot, shipsToBuy });
  }, [selectedSlot, shipsToBuy, uiState]);

  if (!gameData) {
    return null;
  }

  return (
    <LobbyContainer>
      <ContainerLeft>
        <TooltipContainer>
          <TooltipHeader>GAME: {gameData.name}</TooltipHeader>
          <LobbySlots
            gameData={gameData}
            edit={false}
            currentUser={currentUser}
            take={true}
            select={true}
            selectedSlot={selectedSlot}
            game={game}
            ships={ships}
            uiState={uiState}
            onReady={onReady}
          />
        </TooltipContainer>
      </ContainerLeft>
      <ContainerRight>
        <TooltipContainer>
          <TooltipHeader>Buy your fleet</TooltipHeader>
          <FleetStore uiState={uiState} buyShip={buyShip} />
        </TooltipContainer>
      </ContainerRight>
    </LobbyContainer>
  );
};

export default Lobby;
