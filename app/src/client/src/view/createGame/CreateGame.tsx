import React, { useState, useCallback } from "react";

import {
  InputAndLabel,
  Button,
  TooltipContainer,
  TooltipHeader,
} from "../../styled";
import { CloseButton } from "../../styled/Button";
import { LinkInline } from "../../styled/Link";
import GameData from "@fieryvoid3/model/src/game/GameData";
import GameSlot from "@fieryvoid3/model/src/game/GameSlot";
import { Offset } from "@fieryvoid3/model/src/hexagon";
import { User } from "@fieryvoid3/model";
import Slots from "./Slots";
import { redirect } from "react-router-dom";
import { createGame } from "../../api/game";

const createGameData = (user: User) => {
  const gameData = new GameData();

  gameData.slots.addSlot(
    new GameSlot(
      {
        name: "Blue",
        team: 1,
        points: 3000,
        userId: user.id,
        deploymentLocation: new Offset(-150, 0),
        deploymentVector: new Offset(10, 0),
      },
      gameData
    )
  );

  gameData.slots.addSlot(
    new GameSlot(
      {
        name: "Red",
        team: 2,
        points: 3000,
        userId: null,
        deploymentLocation: new Offset(150, 0),
        deploymentVector: new Offset(-10, 0),
      },
      gameData
    )
  );

  gameData.addPlayer(user);
  gameData.name = "Test game";

  return gameData;
};
const CreateGame: React.FC<{ user: User }> = ({ user }) => {
  const [gameData, setGameData] = useState<GameData>(createGameData(user));

  const changeGameName = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      gameData.name = e.target.value;
      setGameData(gameData.clone());
    },
    [gameData, setGameData]
  );

  const createGameCallBack = useCallback(() => {
    (async () => {
      try {
        const response = await createGame(gameData);
        gameData.id = response.gameId;
        setGameData(gameData.clone());
      } catch (e) {
        console.error(e);
      }
    })();
  }, [gameData, setGameData]);

  if (gameData.id) {
    redirect(`/game/${gameData.id}`);
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
          error={!gameData.name ? "Name is required" : undefined}
        />

        <Slots />
        <Button buttonStyle="button-grey" onClick={createGameCallBack}>
          Create game
        </Button>
      </TooltipContainer>
    </>
  );
};

export default CreateGame;
