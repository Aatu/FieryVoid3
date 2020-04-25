import React from "react";
import styled from "styled-components";
import {
  Tooltip,
  TooltipHeader,
  TooltipSubHeader,
  TooltipEntry,
  colors,
  IconAndLabel,
  TooltipValue,
} from "../../../../../styled";
import IncomingTorpedo from "./IncomingTorpedo";

const TorpedoList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const sortFlights = (a, b) => {
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
};

const getTorpedosAgainstThisShip = (ship, gameData) =>
  gameData.torpedos
    .getTorpedoFlights()
    .filter((flight) => flight.targetId === ship.id)
    .sort(sortFlights);

const getTorpedosAgainstFriendlyShips = (
  ship,
  gameData,
  torpedoAttackService
) => {
  const entries = [];
  gameData.torpedos
    .getTorpedoFlights()
    .filter(
      (flight) =>
        flight.targetId !== ship.id &&
        gameData.ships.isSameTeam(
          ship,
          gameData.ships.getShipById(flight.targetId)
        )
    )
    .forEach((flight) => {
      const target = gameData.ships.getShipById(flight.targetId);

      let entry = entries.find(
        ({ ship: entryShip }) => entryShip.id === target.id
      );

      if (!entry) {
        entry = {
          ship: target,
          flights: [],
        };
        entries.push(entry);
      }

      entry.flights.push(flight);
    });

  return entries
    .filter(({ ship: targetShip, flights }) =>
      flights.some((flight) => {
        torpedoAttackService
          .getPossibleInterceptors(ship, flight)
          .some(
            (interceptor) =>
              interceptor.callHandler(
                "getInterceptChance",
                { target: targetShip, torpedoFlight: flight },
                0
              ) > 0
          );
      })
    )
    .map(({ ship: targetShip, flights }) => ({
      ship: targetShip,
      flights: flights.sort(sortFlights),
    }));
};

class TorpedoDefense extends React.Component {
  render() {
    const { uiState, ship } = this.props;

    const gameData = uiState.gameData;
    const torpedos = getTorpedosAgainstThisShip(ship, gameData);

    const friendlyEntries = getTorpedosAgainstFriendlyShips(
      ship,
      gameData,
      uiState.services.torpedoAttackService
    );
    console.log("friendlyEntries", friendlyEntries);

    return (
      <>
        <TooltipHeader>
          {ship.name} <TooltipValue>This ship</TooltipValue>
        </TooltipHeader>
        <div>
          {torpedos.map((flight) => (
            <IncomingTorpedo
              key={`incoming-torpedo-${flight.id}`}
              ship={ship}
              torpedoFlight={flight}
              shooter={ship}
              uiState={uiState}
            />
          ))}
        </div>
        <div>
          {friendlyEntries.map(({ ship: targetShip, flights }) => (
            <div
              key={`incoming-torpedo-friendly-defense-${ship.id}-${targetShip.id}`}
            >
              <TooltipHeader>{targetShip.name}</TooltipHeader>
              {flights.map((flight) => (
                <IncomingTorpedo
                  key={`incoming-torpedo-friendly-${flight.id}`}
                  ship={targetShip}
                  torpedoFlight={flight}
                  shooter={ship}
                  uiState={uiState}
                />
              ))}
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default TorpedoDefense;
