import React, { useState, useCallback, useEffect, useMemo } from "react";

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
import Slots from "./Slots";
import { useNavigate } from "react-router-dom";
import { createGame } from "../../api/game";
import { useUser } from "../../state/userHooks";
import GameStoreProvider from "../game/GameStoreProvider";
import UIState from "../game/ui/UIState";

const createGameData = () => {
  const gameData = new GameData();

  gameData.slots.addSlot(
    new GameSlot(
      {
        name: "Blue",
        team: 1,
        points: 3000,
        userId: null,
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

  gameData.name = "Test game";

  return gameData;
};

const CreateGame: React.FC = () => {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<GameData>(createGameData());
  const uiState = useMemo(() => new UIState(-1), []);

  uiState.update(gameData);

  useEffect(() => {
    if (!user) {
      return;
    }

    gameData.addPlayer(user);
    const slot = gameData.slots.getSlots()[0];
    slot.takeSlot(user);
  }, [gameData, user]);

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
        console.log("create, response", response);
        setGameData(gameData.clone());
      } catch (e) {
        console.error(e);
      }
    })();
  }, [gameData, setGameData]);

  if (gameData.id) {
    console.log("Redirect?");
    navigate(`/game/${gameData.id}`);
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <GameStoreProvider uiState={uiState}>
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
          <Button buttonstyle="button-grey" onClick={createGameCallBack}>
            Create game
          </Button>
        </TooltipContainer>
      </GameStoreProvider>
    </>
  );
};

export default CreateGame;
