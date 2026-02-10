import React, { memo, useEffect, useMemo, useState } from "react";
import GameSceneComponent from "./GameSceneComponent";
import Game from "../Game";
import UIState from "../ui/UIState";
import GameUiComponent from "./GameUiComponent";
import GameStoreProvider from "../GameStoreProvider";
import LoginFloater from "../../login/LoginFloater";
import { useUser } from "../../../state/userHooks";
import { redirect, useParams } from "react-router-dom";
import { User } from "@fieryvoid3/model";
import { useForceRerender } from "../../../util/useForceRerender";
import { createGlobalStyle } from "styled-components";

const GameComponent: React.FC<{ currentUser: User | null }> = memo(
  ({ currentUser }) => {
    const rerender = useForceRerender();
    const [game, setGame] = useState<Game | null>(null);

    const { gameid } = useParams();

    useEffect(() => {
      const id =
        gameid && !isNaN(parseInt(gameid, 10)) ? parseInt(gameid, 10) : null;

      if (!id) {
        return;
      }

      if (game?.gameId === id) {
        return;
      }

      if (game?.currentUser?.id === currentUser?.id) {
        return;
      }

      const newUiState = new UIState(id);
      const newGame = new Game(id, currentUser || null, newUiState);

      setGame(newGame);

      rerender();
    }, [currentUser, gameid, rerender, game]);

    /*
    useEffect(() => {
      return () => {
        if (game) {
          game.deactivate();
        }
      };
    }, [game]);
    */

    if (!gameid) {
      redirect("/");
      return null;
    }

    if (game === null) {
      return null;
    }

    return (
      <GameStoreProvider uiState={game.uiState}>
        <GameSceneComponent game={game} />
        <GameUiComponent />
        <LoginFloater />
      </GameStoreProvider>
    );
  },
  () => true
);

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    height: 100vh;
  }
  #root {
    margin: 0;
    padding: 0;
    height: 100vh;
  }
`;

const GameComponentContainer: React.FC = () => {
  const { data: currentUser, isLoading } = useUser();

  return useMemo(() => {
    if (currentUser === undefined || isLoading) {
      return null;
    }

    return (
      <>
        <GlobalStyle />
        <GameComponent currentUser={currentUser} />
      </>
    );
  }, [currentUser, isLoading]);
};

export default GameComponentContainer;
