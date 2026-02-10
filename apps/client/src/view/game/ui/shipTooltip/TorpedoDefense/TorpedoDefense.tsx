import React from "react";
import { TooltipHeader, TooltipValue } from "../../../../../styled";
import IncomingTorpedo from "./IncomingTorpedo";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import UIState from "../../UIState";
import GameData from "@fieryvoid3/model/src/game/GameData";
import TorpedoAttackService from "@fieryvoid3/model/src/weapon/TorpedoAttackService";
import TorpedoFlight from "@fieryvoid3/model/src/unit/TorpedoFlight";
import { SYSTEM_HANDLERS } from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";

const sortFlights = (a: TorpedoFlight, b: TorpedoFlight) => {
  if (a.torpedo.maxRange < b.torpedo.maxRange) {
    return 1;
  }

  if (a.torpedo.maxRange > b.torpedo.maxRange) {
    return -1;
  }

  if (
    a.torpedo.getDamageStrategy().constructor.name <
    b.torpedo.getDamageStrategy().constructor.name
  ) {
    return 1;
  }

  if (
    a.torpedo.getDamageStrategy().constructor.name >
    b.torpedo.getDamageStrategy().constructor.name
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

const getTorpedosAgainstThisShip = (ship: Ship, gameData: GameData) =>
  gameData.torpedos
    .getTorpedoFlights()
    .filter((flight) => flight.targetId === ship.id)
    .sort(sortFlights);

const getTorpedosAgainstFriendlyShips = (
  ship: Ship,
  gameData: GameData,
  torpedoAttackService: TorpedoAttackService
) => {
  const entries: {
    ship: Ship;
    flights: TorpedoFlight[];
  }[] = [];

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
                SYSTEM_HANDLERS.getInterceptChance,
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

const TorpedoDefense: React.FC<{ ship: Ship; uiState: UIState }> = ({
  uiState,
  ship,
}) => {
  const gameData = uiState.getGameData();
  const torpedos = getTorpedosAgainstThisShip(ship, gameData);

  const friendlyEntries = getTorpedosAgainstFriendlyShips(
    ship,
    gameData,
    uiState.getServices().torpedoAttackService
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
};

export default TorpedoDefense;
