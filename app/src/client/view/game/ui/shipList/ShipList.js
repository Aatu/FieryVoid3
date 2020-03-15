import React, { useContext } from "react";
import styled from "styled-components";
import ShipFleetBadge from "./ShipFleetBadge";
import { StateStore } from "../../../../state/StoreProvider";
import GameData from "../../../../../model/game/GameData.mjs";

const Container = styled.div`
  position: absolute;
  top: 50px;
  ${props => (props.right ? "right: 10px;" : "left: 10px;")}

  z-index: 3;
`;

function ShipListActual({ primary = [], secondary = [], right = false }) {
  return (
    <Container right={right}>
      {primary.map(ship => (
        <ShipFleetBadge key={`ship-fleet-list-${ship.id}`} ship={ship} />
      ))}
    </Container>
  );
}

export default function ShipList({ gameData }) {
  const { currentUser } = useContext(StateStore);

  if (!gameData) {
    return null;
  }

  gameData = new GameData(gameData);
  console.log(gameData);

  const myShips = gameData.ships.getUsersShips(currentUser);

  const alliedShips = gameData.ships
    .getShipsInSameTeam(currentUser)
    .filter(ship => !myShips.includes(ship));

  const enemyShips = gameData.ships.getShipsEnemyTeams(currentUser);

  return (
    <>
      {myShips.length > 0 && (
        <ShipListActual primary={[...myShips]} secondary={alliedShips} />
      )}
      {myShips.length > 0 && <ShipListActual primary={[...enemyShips]} right />}
    </>
  );
}
