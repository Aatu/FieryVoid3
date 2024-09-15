import styled from "styled-components";
import { TooltipContainer, TooltipHeader } from "../../../../styled/Tooltip";
import { FACTIONS } from "@fieryvoid3/model/src/unit/ships/factions";
import { FactionCard } from "../lobby/FactionCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import GameData from "@fieryvoid3/model/src/game/GameData";
import UIState from "../../ui/UIState";
import GameSlot from "@fieryvoid3/model/src/game/GameSlot";
import GameStoreProvider, { useGameStore } from "../../GameStoreProvider";
import ShipTooltip from "../../ui/shipTooltip";
import { useUiStateHandler } from "../../../../state/useUIStateHandler";
import { Button, InputAndLabel } from "../../../../styled";
import { useGameData } from "../../../../state/useGameData";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { createShipInstance } from "@fieryvoid3/model/src/unit/createShipObject";
import { ShipCard } from "../../../../component/ShipCard";
import { useUser } from "../../../../state/userHooks";
import { Offset } from "@fieryvoid3/model/src/hexagon";

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

const StyledShipTooltip = styled(ShipTooltip)`
  left: 0px;
  top: 32px;
`;

const ShipTooltipContainer = styled(TooltipContainer)`
  position: relative;
`;

const FleetBuilderDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: auto 200px;
  margin: 0px 16px;
`;

const StyledButton = styled(Button)`
  flex-grow: 0;
  flex-basis: content;
  width: 100%;
`;

const ShipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
  gap: 8px;
  justify-content: center;
`;

export const FleetBuilder: React.FC<Props> = ({ slot: initialSlot }) => {
  const gameData = useGameData();
  const { data: currentUser } = useUser();
  const [slot] = useState<GameSlot>(() => {
    if (initialSlot) {
      return initialSlot;
    }

    console.log("CREATE NEW SLOT");

    return new GameSlot(
      {
        name: `fleet-ships`,
        team: 1,
        points: 9999999999,
        userId: currentUser,
        deploymentLocation: new Offset(0, 0),
        deploymentVector: new Offset(0, 0),
      },
      gameData
    );
  });

  useEffect(() => {
    console.log("gameData changed");
  }, [gameData]);
  useEffect(() => {
    console.log("initialSlot changed");
  }, [initialSlot]);
  useEffect(() => {
    console.log("currentUser changed", currentUser);
  }, [currentUser]);

  useEffect(() => {
    const gameSlot = gameData.slots.getSlotById(slot.id);

    if (!gameSlot) {
      gameData.slots.addSlot(slot);
    }

    return () => {
      const toDelete = gameData.slots.getSlotById(slot.id);

      if (toDelete) {
        gameData.slots.removeSlot(toDelete);
      }
    };
  }, [slot, gameData]);

  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const state = useGameStore(({ gameState }) => gameState);

  const uiState = useUiStateHandler();
  const [fleetShips, setFleetShips] = useState<Ship[]>(() =>
    gameData.ships.getShips().filter((ship) => ship.slotId === slot.id)
  );

  const buyShip = useCallback(
    (ship: Ship) => {
      const gameSlot = gameData.slots.getSlotById(slot.id);

      if (!gameSlot) {
        throw new Error("Gamedata has no slot");
      }

      const newShip = createShipInstance(ship.shipClass);
      gameSlot.addShip(newShip);
      gameData.ships.addShip(newShip);
      setFleetShips(
        gameData.ships.getShips().filter((s) => s.slotId === slot.id)
      );
    },
    [slot, gameData]
  );

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
              onClick={() => {
                uiState.hideAllShipTooltips();
                setSelectedFaction(faction.name);
              }}
              buyShip={buyShip}
            />
          ))}
        </FactionContainer>
      </TooltipContainer>
      <TooltipContainer>
        <TooltipHeader>Your fleet</TooltipHeader>
        <FleetBuilderDetailsContainer>
          <div>
            <InputAndLabel
              label="Fleet name"
              id="fleetName"
              placeholder="Unnamed fleet"
              onChange={(value) => console.log(value)}
            />
          </div>
          <div>
            <StyledButton
              type="button"
              buttonstyle="button-grey"
              onClick={() => console.log("save fleet")}
            >
              SAVE FLEET
            </StyledButton>
            <StyledButton
              type="button"
              buttonstyle="button-grey"
              onClick={() => console.log("load fleet")}
            >
              LOAD FLEET
            </StyledButton>
            <StyledButton
              type="button"
              buttonstyle="button-grey"
              onClick={() => console.log("clear fleet")}
            >
              CLEAR FLEET
            </StyledButton>
          </div>
        </FleetBuilderDetailsContainer>
        <ShipList>
          {fleetShips.map((ship) => (
            <ShipCard
              key={`shipcard-fleet-${ship.id}`}
              ship={ship}
              size={200}
            />
          ))}
        </ShipList>
      </TooltipContainer>
      <ShipTooltipContainer>
        <TooltipHeader>Current ship</TooltipHeader>
        <>
          {
            state.shipTooltip
              .map((tooltip) => (
                <StyledShipTooltip
                  key={`tooltip-ship-${tooltip.ship.id}`}
                  {...tooltip}
                />
              ))
              .filter(Boolean) as React.ReactNode
          }
        </>
      </ShipTooltipContainer>
    </Container>
  );
};

export const StandaloneFleetBuilder: React.FC<Props> = ({ slot }) => {
  const uiState = useMemo(() => {
    const gameData = new GameData();

    const uiState = new UIState(-1);
    uiState.update(gameData);

    return uiState;
  }, []);

  return (
    <GameStoreProvider uiState={uiState}>
      <FleetBuilder slot={slot} />
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
