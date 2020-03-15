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
import IncomingTorpedo from "./IncomingTorpedo";

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

    return (
      <>
        {torpedos.map(flight => (
          <IncomingTorpedo
            key={`incoming-torpedo-${flight.id}`}
            ship={ship}
            torpedoFlight={flight}
            shooter={ship}
            uiState={uiState}
          />
        ))}
      </>
    );
  }
}

export default TorpedoDefense;
