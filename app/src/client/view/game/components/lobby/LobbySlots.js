import React, { Component } from "react";
import FleetList from "./FleetList";

import Slot from "../../../createGame/Slot";

import { Title, DarkContainer } from "../../../../styled";
class LobbySlots extends Component {
  mapTeamsToComponents() {
    const { gameData, selectedSlot, ships, uiState, onReady } = this.props;

    return gameData.slots.getSlotsByTeams().map(team => {
      return (
        <DarkContainer key={`team-${team.team}`}>
          <Title>TEAM: {team.team}</Title>
          {team.slots.map(slot => {
            if (selectedSlot && slot.id === selectedSlot.id) {
              return (
                <Slot key={slot.id} slot={slot} {...this.props}>
                  <FleetList
                    bought={slot.isBought()}
                    onReady={onReady}
                    uiState={uiState}
                    ships={ships}
                  />
                </Slot>
              );
            } else {
              return <Slot key={slot.id} slot={slot} {...this.props} />;
            }
          })}
        </DarkContainer>
      );
    });
  }

  render() {
    return <>{this.mapTeamsToComponents()}</>;
  }
}

export default LobbySlots;
