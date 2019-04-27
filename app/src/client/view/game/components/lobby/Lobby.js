import React, { Component } from "react";
import styled from "styled-components";
import GameData from "../../../../../model/game/GameData";
import Slots from "../../../createGame/Slots";
import FleetStore from "./FleetStore";

import { Title, PanelContainer, Section } from "../../../../styled";

const LobbyContainer = styled(PanelContainer)`
  width: 1200px;
  position: absolute;
  top: 20px;
  max-height: calc(100vh - 40px);
  left: calc(50vw - 600px);
  right: calc(50vw - 600px);
`;

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSlot: null,
      ships: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { gameData, currentUser } = nextProps;
    if (!gameData) {
      return prevState;
    }

    gameData = new GameData(gameData);

    if (!prevState.selectedSlot) {
      return {
        ...prevState,
        selectedSlot:
          gameData.slots
            .getSlots()
            .find(slot => slot.isOccupiedBy(currentUser)) || null
      };
    }

    return prevState;
  }

  selectSlot() {}

  render() {
    let { uiState, gameData, currentUser, game } = this.props;

    const { selectedSlot } = this.state;

    if (!gameData) {
      return null;
    }

    gameData = new GameData(gameData);

    return (
      <LobbyContainer>
        <Section>
          <div>
            <Title>GAME: '{gameData.name}'</Title>
            <Title>Take a slot and buy ships</Title>
            <Slots
              gameData={gameData}
              edit={false}
              currentUser={currentUser}
              take={true}
              select={true}
              selectedSlot={selectedSlot}
              buyShipsSVGComponentTransferFunctionElement
              game={game}
            />
          </div>
          <FleetStore uiState={uiState} />
        </Section>
      </LobbyContainer>
    );
  }
}

export default Lobby;
