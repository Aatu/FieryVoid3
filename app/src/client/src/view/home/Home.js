import React, { useCallback, useContext, useState } from "react";
import {
  Button,
  Link,
  TooltipContainer,
  TooltipHeader,
  Section,
  Label,
  Value,
  TooltipValue,
} from "../../styled";
import { createTestGameGame } from "../../src/api/game";
import { StateStore } from "../../state/StoreProvider";
import { LinkInline } from "../../styled/Link";
import styled from "styled-components";
import { ChangeLog } from "../game/components/ChangeLog";

const GameIdContainer = styled.div`
  margin: 8px;
  text-transform: uppercase;
`;

const Home = () => {
  const { currentUser } = useContext(StateStore);
  const [gameId, setGameId] = useState(null);

  const createGame = useCallback(() => {
    const callApi = async () => {
      const response = await createTestGame();
      console.log(response);
      setGameId(response.data.gameId);
    };

    callApi();
  }, [setGameId, createTestGameGame]);

  const createGameAi = useCallback(() => {
    const callApi = async () => {
      const response = await createTestGame({ useAI: true });
      console.log(response);
      setGameId(response.data.gameId);
    };

    callApi();
  }, [setGameId, createTestGameGame]);

  return (
    <TooltipContainer>
      <TooltipHeader>Home</TooltipHeader>

      {currentUser && (currentUser.id === 1 || currentUser.id === 2) && (
        <>
          <ChangeLog />
          <Button type="button" buttonStyle="button-grey" onClick={createGame}>
            Create test game
          </Button>
          <Button
            type="button"
            buttonStyle="button-grey"
            onClick={createGameAi}
          >
            Create test game AGAINST AI (Note, the AI can only pass turns for
            now:)
          </Button>
        </>
      )}

      {gameId && (
        <GameIdContainer>
          <Label>Game created:</Label>
          <Value>
            <LinkInline to={`/game/${gameId}`}>{`/game/${gameId}`}</LinkInline>
          </Value>
        </GameIdContainer>
      )}
    </TooltipContainer>
  );
};

export default Home;
