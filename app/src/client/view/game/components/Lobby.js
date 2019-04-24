import React, { Component } from "react";
import styled from "styled-components";
import GameData from "../../../../model/game/GameData";
import Slots from "../../createGame/Slots";

import { Title, PanelContainer } from "../../../styled";

const LobbyContainer = styled(PanelContainer)`
  width: 1200px;
  position: absolute;
  top: 20px;
  bottom: 20px;
  left: calc(50vw - 600px);
  right: calc(50vw - 600px);
`;

class Lobby extends Component {
  render() {
    let { gameData, currentUser, game } = this.props;

    if (!gameData) {
      return null;
    }

    gameData = new GameData(gameData);

    return (
      <LobbyContainer>
        <Title>GAME: '{gameData.name}'</Title>
        <Title>Take a slot and buy ships</Title>
        <Slots
          gameData={gameData}
          edit={false}
          currentUser={currentUser}
          take={true}
          buyShips={true}
          game={game}
        />
      </LobbyContainer>
    );
  }
}

export default Lobby;
