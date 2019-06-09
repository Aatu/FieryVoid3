import React, { Component } from "react";
import styled from "styled-components";
import GameData from "../../../../../model/game/GameData";
import LobbySlots from "./LobbySlots";
import FleetStore from "./FleetStore";
import shipClasses from "../../../../../model/unit/ships";

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
      const selectedSlot =
        gameData.slots
          .getSlots()
          .find(slot => slot.isOccupiedBy(currentUser)) || null;

      const ships = selectedSlot ? selectedSlot.getShips() : [];
      return {
        ...prevState,
        selectedSlot,
        ships
      };
    }

    return prevState;
  }

  selectSlot() {}

  buyShip(shipClass) {
    const ship = new shipClasses[shipClass]();
    const { selectedSlot, ships } = this.state;

    if (!selectedSlot) {
      return;
    }

    const totalCost = [...ships, ship].reduce(
      (acc, ship) => acc + ship.getPointCost(),
      0
    );

    if (totalCost > selectedSlot.points) {
      alert("Too costly");
      return;
    }

    this.setState({ ships: [...ships, ship] });
  }

  onReady() {
    const { uiState } = this.props;
    const { selectedSlot, ships } = this.state;
    uiState.customEvent("buyShips", { slot: selectedSlot, ships });
  }

  render() {
    let { uiState, gameData, currentUser, game } = this.props;

    const { selectedSlot, ships } = this.state;

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
            <LobbySlots
              gameData={gameData}
              edit={false}
              currentUser={currentUser}
              take={true}
              select={true}
              selectedSlot={selectedSlot}
              game={game}
              ships={ships}
              uiState={uiState}
              onReady={this.onReady.bind(this)}
            />
          </div>
          <FleetStore uiState={uiState} buyShip={this.buyShip.bind(this)} />
        </Section>
      </LobbyContainer>
    );
  }
}

export default Lobby;
