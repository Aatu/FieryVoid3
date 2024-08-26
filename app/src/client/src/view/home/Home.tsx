import React, { useCallback, useState } from "react";
import {
  Button,
  TooltipContainer,
  TooltipHeader,
  Label,
  Value,
} from "../../styled";
import { LinkInline } from "../../styled/Link";
import styled from "styled-components";
import { ChangeLog } from "../game/components/ChangeLog";
import { useUser } from "../../state/userHooks";
import { createTestGame } from "../../api/game";

const GameIdContainer = styled.div`
  margin: 8px;
  text-transform: uppercase;
`;

const Home: React.FC = () => {
  const { data: currentUser } = useUser();
  const [gameId, setGameId] = useState<number | null>(null);

  const createGame = useCallback(async () => {
    const response = await createTestGame();
    console.log(response);
    setGameId(response.gameId);
  }, []);

  const createGameAi = useCallback(async () => {
    const response = await createTestGame({ useAI: true });
    console.log(response);
    setGameId(response.gameId);
  }, []);

  return (
    <TooltipContainer>
      <TooltipHeader>Home</TooltipHeader>

      {currentUser && (currentUser.id === 1 || currentUser.id === 2) && (
        <>
          <ChangeLog />
          <Button type="button" buttonstyle="button-grey" onClick={createGame}>
            Create test game
          </Button>
          <Button
            type="button"
            buttonstyle="button-grey"
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
