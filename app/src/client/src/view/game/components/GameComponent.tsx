import React, { useContext, useEffect, useState } from "react";
import GameSceneComponent from "./GameSceneComponent";
import Game from "../Game";
import UIState from "../ui/UIState";
import GameUiComponent from "./GameUiComponent";
import { StateStore } from "../../../state/StoreProvider";
import GameStoreProvider from "../GameStoreProvider";
import LoginFloater from "../../login/LoginFloater";
import { useUser } from "../../../state/userHooks";
import { useParams } from "react-router-dom";

const GameComponent: React.FC = () => {
  const { data: currentUser } = useUser();
  const { gameid } = useParams();
  const [uiState, setUiState] = useState<UIState | null>(null);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const newUiState = new UIState();
    const newGame = new Game(gameid, currentUser, newUiState);
    setUiState(newUiState);
    setGame(newGame);
  }, [currentUser, setUiState, setGame, gameid]);

  if (!uiState || !game || currentUser === undefined) {
    return null;
  }

  return (
    <GameStoreProvider uiState={uiState}>
      <GameSceneComponent game={game} currentUser={currentUser} />
      <GameUiComponent game={game} />
      <LoginFloater />
    </GameStoreProvider>
  );
};

export default GameComponent;
