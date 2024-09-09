import styled from "styled-components";
import { TooltipContainer, TooltipHeader } from "../../../../styled/Tooltip";
import { FACTIONS } from "@fieryvoid3/model/src/unit/ships/factions";
import { FactionCard } from "../lobby/FactionCard";
import { useMemo, useState } from "react";
import GameData from "@fieryvoid3/model/src/game/GameData";
import UIState from "../../ui/UIState";
import GameSlot from "@fieryvoid3/model/src/game/GameSlot";
import GameStoreProvider, { useGameStore } from "../../GameStoreProvider";
import ShipTooltip from "../../ui/shipTooltip";

const GameOverlayContainer = styled.div`
  position: absolute;
  top: 32px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 3;
  padding: 16px;
`;

const Container = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  gap: 8px;
`;

const FactionContainer = styled.div`
  & > * {
    margin-top: 8px;
  }
  padding: 0 8px 8px 8px;
`;

type Props = {
  slot?: GameSlot;
};

export const FleetBuilder: React.FC<Props> = () => {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);

  return (
    <Container>
      <TooltipContainer>
        <TooltipHeader>Factions</TooltipHeader>
        <FactionContainer>
          {FACTIONS.map((faction) => (
            <FactionCard
              key={faction.name}
              faction={faction}
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
  );
};

export const StandaloneFleetBuilder: React.FC<Props> = ({ slot }) => {
  const state = useGameStore(({ gameState }) => gameState);
  const uiState = useMemo(() => {
    const gameData = new GameData();
    if (slot) {
      gameData.slots.addSlot(slot);
    }

    const uiState = new UIState(-1);
    uiState.update(gameData);

    return uiState;
  }, [slot]);

  return (
    <GameStoreProvider uiState={uiState}>
      <FleetBuilder slot={slot} />
      <>
        {
          state.shipTooltip
            .map((tooltip) => (
              <ShipTooltip
                key={`tooltip-ship-${tooltip.ship.id}`}
                {...tooltip}
              />
            ))
            .filter(Boolean) as React.ReactNode
        }
      </>
    </GameStoreProvider>
  );
};

export const InGameFleetBuider: React.FC<Props> = ({ slot }) => {
  return (
    <GameOverlayContainer>
      <FleetBuilder slot={slot} />
    </GameOverlayContainer>
  );
};
