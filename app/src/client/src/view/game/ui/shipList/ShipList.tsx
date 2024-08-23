import React from "react";
import styled from "styled-components";
import ShipFleetBadge from "./ShipFleetBadge";
import UIState from "../UIState";
import { useUser } from "../../../../state/userHooks";
import Ship from "@fieryvoid3/model/src/unit/Ship";

type ContainerProps = {
  right: boolean;
};

const Container = styled.div<ContainerProps>`
  position: absolute;
  top: 50px;
  ${(props) => (props.right ? "right: 10px;" : "left: 10px;")}

  z-index: 3;
`;

type ShipListActualProps = {
  uiState: UIState;
  primary: Ship[];
  secondary?: Ship[];
  right?: boolean;
};

const ShipListActual: React.FC<ShipListActualProps> = ({
  uiState,
  primary = [],
  right = false,
}) => {
  return (
    <Container right={right}>
      {primary.map((ship) => (
        <ShipFleetBadge
          key={`ship-fleet-list-${ship.id}`}
          ship={ship}
          uiState={uiState}
        />
      ))}
    </Container>
  );
};

const ShipList: React.FC<{ uiState: UIState }> = ({ uiState }) => {
  const { data: currentUser } = useUser();

  const gameData = uiState.getState().gameData;

  if (!gameData) {
    return null;
  }

  // TODO: WTF, why was gamedata cloned???
  //gameData = new GameData(gameData);

  const myShips = gameData.ships
    .getUsersShips(currentUser || null)
    .filter((ship) => !ship.isDestroyed());

  const alliedShips = gameData.ships
    .getShipsInSameTeam(currentUser || null)
    .filter((ship) => !ship.isDestroyed())
    .filter((ship) => !myShips.includes(ship));

  const enemyShips = gameData.ships
    .getShipsEnemyTeams(currentUser || null)
    .filter((ship) => !ship.isDestroyed());

  return (
    <>
      {myShips.length > 0 && (
        <ShipListActual
          uiState={uiState}
          primary={[...myShips]}
          secondary={alliedShips}
        />
      )}
      {myShips.length > 0 && (
        <ShipListActual uiState={uiState} primary={[...enemyShips]} right />
      )}
    </>
  );
};

export default ShipList;
