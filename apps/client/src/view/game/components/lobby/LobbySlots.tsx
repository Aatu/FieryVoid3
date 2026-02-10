import React from "react";
import FleetList from "./FleetList";

import Slot from "../../../createGame/Slot";

import { Title, DarkContainer } from "../../../../styled";
import GameData from "@fieryvoid3/model/src/game/GameData";
import GameSlot from "@fieryvoid3/model/src/game/GameSlot";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import UIState from "../../ui/UIState";

type Props = {
  gameData: GameData;
  selectedSlot: GameSlot | null;
  ships: Ship[];
  uiState: UIState;
  onReady: () => void;
};

const LobbySlots: React.FC<Props> = ({
  gameData,
  selectedSlot,
  ships,
  uiState,
  onReady,
}) => {
  const mapTeamsToComponents = () => {
    return gameData.slots.getSlotsByTeams().map((team) => {
      return (
        <DarkContainer key={`team-${team.team}`}>
          <Title>TEAM: {team.team}</Title>
          {team.slots.map((slot) => {
            if (selectedSlot && slot.id === selectedSlot.id) {
              return (
                <Slot key={slot.id} slot={slot}>
                  <FleetList
                    bought={slot.isBought()}
                    onReady={onReady}
                    uiState={uiState}
                    ships={ships}
                  />
                </Slot>
              );
            } else {
              return <Slot key={slot.id} slot={slot} />;
            }
          })}
        </DarkContainer>
      );
    });
  };

  return <>{mapTeamsToComponents()}</>;
};

export default LobbySlots;
