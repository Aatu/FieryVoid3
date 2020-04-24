import React, { useContext } from "react";
import styled from "styled-components";
import ShipFleetBadge from "./ShipFleetBadge";
import { StateStore } from "../../../../state/StoreProvider";
import GameData from "../../../../../model/game/GameData.mjs";

const Container = styled.div`
  position: absolute;
  top: 50px;
  ${(props) => (props.right ? "right: 10px;" : "left: 10px;")}

  z-index: 3;
`;

function ShipListActual({
  uiState,
  primary = [],
  secondary = [],
  right = false,
}) {
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
}

export default function ShipList({ gameData, uiState }) {
  const { currentUser } = useContext(StateStore);

  if (!gameData) {
    return null;
  }

  gameData = new GameData(gameData);

  const myShips = gameData.ships
    .getUsersShips(currentUser)
    .filter((ship) => !ship.isDestroyed());

  const alliedShips = gameData.ships
    .getShipsInSameTeam(currentUser)
    .filter((ship) => !ship.isDestroyed())
    .filter((ship) => !myShips.includes(ship));

  const enemyShips = gameData.ships
    .getShipsEnemyTeams(currentUser)
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
}
