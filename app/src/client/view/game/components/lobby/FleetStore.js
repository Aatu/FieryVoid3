import React, { Component } from "react";
import styled from "styled-components";
import factions from "../../../../../model/unit/ships/factions";
import Faction from "./Faction";

import { Title, DarkContainer, Section } from "../../../../styled";

const FleetContainer = styled(DarkContainer)`
  flex-grow: 1;
  margin-left: 10px;
`;

class FleetStore extends Component {
  render() {
    return (
      <FleetContainer>
        {factions.map(faction => (
          <Faction key={faction.name} faction={faction} {...this.props} />
        ))}
      </FleetContainer>
    );
  }
}

export default FleetStore;
