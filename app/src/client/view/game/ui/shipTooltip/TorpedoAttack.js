import React from "react";
import TorpedoAttackService from "../../../../../model/weapon/TorpedoAttackService.mjs";
import styled from "styled-components";
import {
  Tooltip,
  TooltipHeader,
  TooltipSubHeader,
  TooltipEntry,
  colors,
  IconAndLabel
} from "../../../../styled";
import CargoItem from "../system/SystemStrategyUi/cargo/CargoItem";
import TorpedoAttackTooltip from "./TorpedoAttackTooltip";
import TorpedoMovementService from "../../../../../model/movement/TorpedoMovementService.mjs";
import TorpedoFlight from "../../../../../model/unit/TorpedoFlight.mjs";
import WeaponTargetingList from "./WeaponTargetingList";

const Container = styled.div`
  z-index: 3;
`;

const Cell = styled.div`
  width: 25%;
  display: flex;

  justify-content: center;

  :first-child {
    width: 50%;
    justify-content: flex-start;
  }

  :last-child {
    justify-content: flex-end;
  }
`;

const TorpedoList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

class TorpedoAttack extends React.Component {
  render() {
    const { uiState, ship: target } = this.props;

    const gameData = uiState.gameData;

    const ships = gameData.ships
      .getShips()
      .filter(otherShip => !gameData.ships.isSameTeam(target, otherShip))
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
        {ships.map(shooter => (
          <WeaponTargetingList
            shooter={shooter}
            uiState={uiState}
            ship={target}
            key={`weaponTargetingList-${shooter.id}`}
          />
        ))}
      </Container>
    );
  }
}

export default TorpedoAttack;
