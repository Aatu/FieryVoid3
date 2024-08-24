import React from "react";
import styled from "styled-components";
import Faction from "./Faction";
import { FACTIONS } from "@fieryvoid3/model/src/unit/ships/factions";

import { DarkContainer } from "../../../../styled";
import UIState from "../../ui/UIState";

const FleetContainer = styled(DarkContainer)`
  flex-grow: 1;
  margin-left: 10px;
`;

const FleetStore: React.FC<{
  buyShip: (className: string) => void;
  uiState: UIState;
}> = (props) => {
  return (
    <FleetContainer>
      {FACTIONS.map((faction) => (
        <Faction key={faction.name} faction={faction} {...props} />
      ))}
    </FleetContainer>
  );
};

export default FleetStore;
