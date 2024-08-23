import React, { useEffect, useState } from "react";
import GameSceneComponent from "./GameSceneComponent";
import Game from "../Game";
import UIState from "../ui/UIState";
import GameUiComponent from "./GameUiComponent";
import GameStoreProvider from "../GameStoreProvider";
import LoginFloater from "../../login/LoginFloater";
import { useUser } from "../../../state/userHooks";
import { redirect, useParams } from "react-router-dom";

const GameComponent: React.FC = () => {
  const { data: currentUser } = useUser();
  const { gameid } = useParams();
  const [uiState, setUiState] = useState<UIState | null>(null);
  const [game, setGame] = useState<Game | null>(null);

  if (!gameid || isNaN(parseInt(gameid, 10))) {
    redirect("/");
  }

  useEffect(() => {
    if (!gameid || isNaN(parseInt(gameid, 10))) {
      return;
    }
    const newUiState = new UIState();
    const newGame = new Game(
      parseInt(gameid, 10),
      currentUser || null,
      newUiState
    );
    setUiState(newUiState);
    setGame(newGame);
  }, [currentUser, setUiState, setGame, gameid]);

  if (!uiState || !game || currentUser === undefined) {
    return null;
  }

  return (
    <GameStoreProvider uiState={uiState}>
      <GameSceneComponent game={game} />
      <GameUiComponent game={game} />
      <LoginFloater />
    </GameStoreProvider>
  );
};

export default GameComponent;
