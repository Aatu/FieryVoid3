import React, { Component } from "react";

import Slot from "./Slot";

import { Title, DarkContainer } from "../../styled";
import styled from "styled-components";

const Container = styled.div`
  margin: 0 8px 8px 8px;
`;

class Slots extends Component {
  mapTeamsToComponents() {
    const { gameData } = this.props;
    return gameData.slots.getSlotsByTeams().map((team) => {
      return (
        <Container>
          <DarkContainer key={`team-${team.team}`}>
            <Title>TEAM: {team.team}</Title>
            {team.slots.map((slot) => (
              <Slot key={slot.id} slot={slot} {...this.props} />
            ))}
          </DarkContainer>
        </Container>
      );
    });
  }

  handleChange() {}

  render() {
    return <>{this.mapTeamsToComponents()}</>;
  }
}

export default Slots;
