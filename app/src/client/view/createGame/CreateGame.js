import React, {
  Component,
  useContext,
  useState,
  useEffect,
  useCallback,
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
  Button,
  Link,
  TooltipContainer,
  TooltipHeader,
} from "../../styled";
import { StateStore } from "../../state/StoreProvider";
import { CloseButton } from "../../styled/Button";
import { LinkInline } from "../../styled/Link";

const Container = styled.div`
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
        deploymentVector: new hexagon.Offset(10, 0),
      })
    );

    gameData.slots.addSlot(
      new GameSlot({
        name: "Red",
        team: 2,
        points: 3000,
        userId: null,
        deploymentLocation: new hexagon.Offset(150, 0),
        deploymentVector: new hexagon.Offset(-10, 0),
      })
    );

    gameData.addPlayer(user);
    gameData.name = "Test game";

    setGameData(gameData.clone());
  }, [setGameData]);

  const changeGameName = useCallback(
    (e) => {
      gameData.name = e.target.value;
      setGameData(gameData.clone());
    },
    [gameData, setGameData]
  );

  const createGameCallBack = useCallback(() => {
    (async () => {
      try {
        const response = await createGame(gameData);
        gameData.id = response.data.gameId;
        setGameData(gameData.clone());
      } catch (e) {
        console.error(e);
      }
    })();
  }, [gameData, setGameData]);

  if (gameData.id) {
    return (
      <Redirect
        to={{ pathname: `/game/${gameData.id}`, state: { from: location } }}
      />
    );
  }

  return (
    <>
      <TooltipContainer>
        <TooltipHeader>
          Create game
          <LinkInline to="/">
            <CloseButton />
          </LinkInline>
        </TooltipHeader>

        <InputAndLabel
          placeholder="name"
          value={gameData.name}
          onChange={changeGameName}
          error={!gameData.name ? "Name is required" : false}
        />

        <Slots gameData={gameData} />
        <Button buttonStyle="button-grey" onClick={createGameCallBack}>
          Create game
        </Button>
      </TooltipContainer>
    </>
  );
};

export default CreateGame;
