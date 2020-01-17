import React, { useContext, useEffect, useState } from "react";
import GameSceneComponent from "./GameSceneComponent";
import Game from "../Game";
import UIState from "../ui/UIState";
import GameUiComponent from "./GameUiComponent";
import { StateStore } from "../../../state/StoreProvider";
import GameStoreProvider from "../GameStoreProvider";
import LoginFloater from "../../login/LoginFloater";

const GameComponent = ({ match }) => {
  const { currentUser } = useContext(StateStore);
  const [uiState, setUiState] = useState(null);
  const [game, setGame] = useState(null);

  useEffect(() => {
    const newUiState = new UIState();
    const newGame = new Game(match.params.gameid, currentUser, newUiState);
    setUiState(newUiState);
    setGame(newGame);
  }, [currentUser, setUiState, setGame]);

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
