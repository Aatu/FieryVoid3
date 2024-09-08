import React from "react";

import Slot from "./Slot";

import { TooltipContainer, TooltipHeader } from "../../styled";
import { useGameData } from "../../state/useGameData";

const Slots: React.FC = () => {
  const gameData = useGameData();

  const mapTeamsToComponents = () => {
    return gameData.slots.getSlotsByTeams().map((team) => {
      return (
        <TooltipContainer>
          <TooltipHeader>TEAM: {team.team}</TooltipHeader>
          {team.slots.map((slot) => (
            <Slot key={slot.id} slot={slot} />
          ))}
        </TooltipContainer>
      );
    });
  };

  return <>{mapTeamsToComponents()}</>;
};

export default Slots;
