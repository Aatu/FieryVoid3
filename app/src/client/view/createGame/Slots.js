import React, { Component } from "react";

import Slot from "./Slot";

import { Title, DarkContainer } from "../../styled";

class Slots extends Component {
  mapTeamsToComponents() {
    const { gameData } = this.props;
    return gameData.slots.getSlotsByTeams().map(team => {
      return (
        <DarkContainer key={`team-${team.team}`}>
          <Title>TEAM: {team.team}</Title>
          {team.slots.map(slot => (
            <Slot key={slot.id} slot={slot} {...this.props} />
          ))}
        </DarkContainer>
      );
    });
  }

  handleChange() {}

  render() {
    return <>{this.mapTeamsToComponents()}</>;
  }
}

export default Slots;
