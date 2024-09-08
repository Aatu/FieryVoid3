import styled from "styled-components";
import { TooltipContainer, TooltipHeader } from "../../../../styled/Tooltip";
import { FACTIONS } from "@fieryvoid3/model/src/unit/ships/factions";
import { FactionCard } from "../lobby/FactionCard";
import { useMemo, useState } from "react";
import GameData from "@fieryvoid3/model/src/game/GameData";
import UIState from "../../ui/UIState";
import GameSlot from "@fieryvoid3/model/src/game/GameSlot";

const GameOverlayContainer = styled.div`
  position: absolute;
  top: 32px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 3;
`;

const Container = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  margin: 16px;
  gap: 8px;
`;

const FactionContainer = styled.div`
  & > * {
    margin-top: 8px;
  }
  padding: 0 8px 8px 8px;
`;

type Props = {
  slot: GameSlot;
};

export const FleetBuilder: React.FC<Props> = ({ slot }) => {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);

  const [gameData, uiState] = useMemo(() => {
    const gameData = new GameData();
    gameData.slots.addSlot(slot);

    const uiState = new UIState(-1);
    uiState.update(gameData);

    return [gameData, uiState];
  }, [slot]);

  return (
    <GameOverlayContainer>
      <Container>
        <TooltipContainer>
          <TooltipHeader>Factions</TooltipHeader>
          <FactionContainer>
            {FACTIONS.map((faction) => (
              <FactionCard
                key={faction.name}
                faction={faction}
                uiState={uiState}
                isOpen={selectedFaction === faction.name}
                onClick={() => setSelectedFaction(faction.name)}
              />
            ))}
          </FactionContainer>
        </TooltipContainer>
        <TooltipContainer>
          <TooltipHeader>Your fleet</TooltipHeader>
        </TooltipContainer>
        <TooltipContainer>
          <TooltipHeader>Current ship</TooltipHeader>
        </TooltipContainer>
      </Container>
    </GameOverlayContainer>
  );
};
