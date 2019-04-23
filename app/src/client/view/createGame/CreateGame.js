import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import GameData from "../../../model/game/GameData";
import GameSlot from "../../../model/game/GameSlot";
import hexagon from "../../../model/hexagon";
import Slots from "./Slots";
import { createGame } from "../../api/game";

import {
  Title,
  InputAndLabel,
  PanelContainer,
  Button,
  Link
} from "../../styled";

const Container = styled(PanelContainer)`
  width: 1200px;
`;

class CreateGame extends Component {
  constructor(props) {
    super(props);

    const { user } = this.props;

    const gameData = new GameData();

    gameData.slots.addSlot(
      new GameSlot({
        name: "Blue",
        team: 1,
        points: 3000,
        userId: user.id,
        deploymentLocation: new hexagon.Offset(-30, 0),
        deploymentVector: new hexagon.Offset(10, 0)
      })
    );

    gameData.slots.addSlot(
      new GameSlot({
        name: "Red",
        team: 2,
        points: 3000,
        userId: null,
        deploymentLocation: new hexagon.Offset(30, 0),
        deploymentVector: new hexagon.Offset(-10, 0)
      })
    );

    gameData.addPlayer(user);
    gameData.name = "Test game";

    this.state = {
      gameData: gameData
    };
  }

  async createGame() {
    const { gameData } = this.state;
    console.log("hi");
    try {
      const response = await createGame(gameData);
      gameData.id = response.data.gameId;
      this.setState({ gameData });
      console.log(gameData);
    } catch (e) {
      console.log(e);
    }
  }

  handleChange() {}

  render() {
    const { gameData, location } = this.state;
    console.log(gameData);

    if (gameData.id) {
      return (
        <Redirect
          to={{ pathname: `/game/${gameData.id}`, state: { from: location } }}
        />
      );
    }
    return (
      <Container>
        <Link to="/">
          <Button type="button" buttonStyle="button-grey">
            Back
          </Button>
        </Link>
        <Title>Create game</Title>
        <InputAndLabel
          label="Game name"
          id="name"
          placeholder="name"
          value={gameData.name}
          onChange={this.handleChange}
          error={!gameData.name ? "Name is required" : false}
        />

        <Slots gameData={gameData} />
        <Button
          type="button"
          buttonStyle="button-grey"
          onClick={this.createGame.bind(this)}
        >
          Create game
        </Button>
      </Container>
    );
  }
}

export default connect(({ user }) => ({
  user: user.current
}))(CreateGame);
