import React, { Component } from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import GameData from "../../../model/game/GameData";
import GameSlot from "../../../model/game/GameSlot";
import hexagon from "../../../model/hexagon";

import Slot from "./Slot";

import {
  Title,
  InputAndLabel,
  PanelContainer,
  Button,
  Error,
  Link,
  DarkContainer
} from "../../styled";

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
            <Slot key={slot.id} slot={slot} edit={true} />
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
