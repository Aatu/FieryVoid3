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
import { createTestGameGame } from "../../api/game";
import { StateStore } from "../../state/StoreProvider";
import { LinkInline } from "../../styled/Link";
import styled from "styled-components";

const GameIdContainer = styled.div`
  margin: 8px;
  text-transform: uppercase;
`;

const Home = () => {
  const { currentUser } = useContext(StateStore);
  const [gameId, setGameId] = useState(null);

  const createGame = useCallback(() => {
    const callApi = async () => {
      const response = await createTestGameGame();
      console.log(response);
      setGameId(response.data.gameId);
    };

    callApi();
  }, [setGameId, createTestGameGame]);

  return (
    <TooltipContainer>
      <TooltipHeader>Home</TooltipHeader>

      {currentUser && (currentUser.id === 1 || currentUser.id === 2) && (
        <Button type="button" buttonStyle="button-grey" onClick={createGame}>
          Create test game
        </Button>
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
