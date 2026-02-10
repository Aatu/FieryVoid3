import React from "react";
import WeaponTargetingList from "./WeaponTargetingList";
import styled from "styled-components";
import UIState from "../UIState";
import Ship from "@fieryvoid3/model/src/unit/Ship";

const Container = styled.div`
  z-index: 3;
`;

const TorpedoAttack: React.FC<{
  uiState: UIState;
  ship: Ship;
  right: boolean;
}> = ({ uiState, ship: target, right }) => {
  const gameData = uiState.getGameData();

  const ships = gameData.ships
    .getShips()
    .filter((otherShip) => !gameData.ships.isSameTeam(target, otherShip))
    .sort((a, b) => {
      if (a.distanceTo(target) < b.distanceTo(target)) {
        return 1;
      }

      if (a.distanceTo(target) > b.distanceTo(target)) {
        return -1;
      }

      return 0;
    });

  return (
    <Container>
      {ships.map((shooter) => (
        <WeaponTargetingList
          showZeroHitChance={false}
          shooter={shooter}
          uiState={uiState}
          ship={target}
          key={`weaponTargetingList-${shooter.id}`}
          right={right}
        />
      ))}
    </Container>
  );
};

export default TorpedoAttack;
