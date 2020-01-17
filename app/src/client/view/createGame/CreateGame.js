import React, {
  Component,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
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
import { StateStore } from "../../state/StoreProvider";

const Container = styled(PanelContainer)`
  width: 1200px;
`;

const CreateGame = ({ location }) => {
  const state = useContext(StateStore);
  const user = state.currentUser;
  const [gameData, setGameData] = useState(new GameData());

  useEffect(() => {
    gameData.slots.addSlot(
      new GameSlot({
        name: "Blue",
        team: 1,
        points: 3000,
        userId: user.id,
        deploymentLocation: new hexagon.Offset(-150, 0),
        deploymentVector: new hexagon.Offset(10, 0)
      })
    );

    gameData.slots.addSlot(
      new GameSlot({
        name: "Red",
        team: 2,
        points: 3000,
        userId: null,
        deploymentLocation: new hexagon.Offset(150, 0),
        deploymentVector: new hexagon.Offset(-10, 0)
      })
    );

    gameData.addPlayer(user);
    gameData.name = "Test game";

    setGameData(gameData);
  }, [setGameData]);

  const changeGameName = useCallback(
    e => {
      console.log(e);
      gameData.name = "hi";
      setGameData(gameData);
    },
    [gameData, setGameData]
  );

  const createGame = useCallback(() => {
    (async () => {
      try {
        const response = await createGame(gameData);
        gameData.id = response.data.gameId;
        this.setState({ gameData });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [gameData]);

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
        onChange={changeGameName}
        error={!gameData.name ? "Name is required" : false}
      />

      <Slots gameData={gameData} />
      <Button type="button" buttonStyle="button-grey" onClick={createGame}>
        Create game
      </Button>
    </Container>
  );
};

export default CreateGame;
