import React, { Component } from "react";

import Slot from "./Slot";

import { Title, DarkContainer } from "../../styled";

class Slots extends Component {
  getSlotsByTeams() {
    const { gameData } = this.props;

    const teams = [];

    gameData.slots.getSlots().forEach(slot => {
      let team = teams.find(t => t.team === slot.team);

      if (!team) {
        team = {
          team: slot.team,
          slots: [slot]
        };
        teams.push(team);
      } else {
        team.slots.push(slot);
      }
    });

    return teams;
  }

  mapTeamsToComponents() {
    return this.getSlotsByTeams().map(team => {
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
