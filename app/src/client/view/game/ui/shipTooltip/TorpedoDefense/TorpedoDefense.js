import React from "react";
import styled from "styled-components";
import {
  Tooltip,
  TooltipHeader,
  TooltipSubHeader,
  TooltipEntry,
  colors,
  IconAndLabel
} from "../../../../../styled";
import TorpedoFlight from "../../../../../../model/unit/TorpedoFlight.mjs";
import IncomingTorpedo from "../IncomingTorpedo";

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

class TorpedoDefense extends React.Component {
  render() {
    const { uiState, ship } = this.props;

    const gameData = uiState.gameData;

    const torpedos = gameData.torpedos
      .getTorpedoFlights()
      .filter(flight => flight.targetId === ship.id)
      .sort((a, b) => {
        if (a.torpedo.maxRange < b.torpedo.maxRange) {
          return 1;
        }

        if (a.torpedo.maxRange > b.torpedo.maxRange) {
          return -1;
        }

        if (
          a.torpedo.damageStrategy.constructor.name <
          b.torpedo.damageStrategy.constructor.name
        ) {
          return 1;
        }

        if (
          a.torpedo.damageStrategy.constructor.name >
          b.torpedo.damageStrategy.constructor.name
        ) {
          return -1;
        }

        if (a.torpedo.getDisplayName() < b.torpedo.getDisplayName()) {
          return 1;
        }

        if (a.torpedo.getDisplayName() > b.torpedo.getDisplayName()) {
          return -1;
        }

        return 0;
      });

    console.log(torpedos);

    return (
      <>
        {torpedos.map(flight => (
          <IncomingTorpedo
            key={`incoming-torpedo-${flight.id}`}
            ship={ship}
            torpedoFlight={flight}
            shooter={gameData.ships.getShipById(flight.shooterId)}
          />
        ))}
      </>
    );
  }
}

export default TorpedoDefense;
