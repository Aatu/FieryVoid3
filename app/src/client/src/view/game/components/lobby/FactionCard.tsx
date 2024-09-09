import React, { MouseEventHandler, useEffect, useState } from "react";
import { TooltipHeader, colors } from "../../../../styled";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { Faction } from "@fieryvoid3/model/src/unit/ships/factions";
import styled from "styled-components";
import { ClickableProps } from "../../../../styled/Clickable";
import { createShipInstance } from "@fieryvoid3/model/src/unit/createShipObject";
import { ShipCard } from "../../../../component/ShipCard";
import { useGameData } from "../../../../state/useGameData";
import GameSlot from "@fieryvoid3/model/src/game/GameSlot";
import Offset from "@fieryvoid3/model/src/hexagon/Offset";

const ImageContainer = styled.img`
  border-right: 1px solid #aaaaaa;
  width: 100px;
  height: 100px;
  background-color: black;
  padding: 8px;
`;

const GridContainer = styled.div`
  border: 1px solid #aaaaaa;
  display: grid;
  grid-template-columns: 116px auto;
  cursor: pointer;
`;

const Container = styled.div<ClickableProps>`
  border: 1px solid #aaaaaa;
  display: flex;
  flex-direction: column;

  &:hover {
    border: 1px solid white;

    ${ImageContainer} {
      border-right: 1px solid white;
    }
  }
`;

type ShipListProps = {
  isOpen?: boolean;
};

const ShipList = styled.div<ShipListProps>`
  height: ${({ isOpen }) => (isOpen ? "0px" : "auto")};
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
  gap: 8px;
  justify-content: center;
`;

const DescriptionContainer = styled.div`
  text-align: left;
  padding: 3px 8px 6px 8px;
  color: ${colors.lightBlue};
`;

type Props = {
  faction: Faction;
  isOpen?: boolean;
  onClick?: MouseEventHandler;
};

export const FactionCard: React.FC<Props> = ({ faction, isOpen, onClick }) => {
  const [ships, setShips] = useState<Ship[]>([]);

  const gameData = useGameData();

  useEffect(() => {
    const ships = faction.ships.map((shipClass) =>
      createShipInstance(shipClass)
    );

    const slot = gameData.slots
      .getSlots()
      .find((slot) => slot.name === `${faction.name}-ships`);

    if (!slot) {
      const newSlot = new GameSlot(
        {
          name: `${faction.name}-ships`,
          team: 999,
          points: 9999999999,
          userId: -2,
          deploymentLocation: new Offset(0, 0),
          deploymentVector: new Offset(0, 0),
        },
        gameData
      );

      ships.forEach((s) => gameData.ships.addShip(s));
      ships.forEach((s) => newSlot.addShip(s));

      gameData.slots.addSlot(newSlot);

      setShips(ships);
    }

    return () => {
      const slotToClenup = gameData.slots
        .getSlots()
        .find((slot) => slot.name === `${faction.name}-ships`);

      if (slotToClenup) {
        gameData.slots.removeSlot(slotToClenup);
      }

      ships.forEach((ship) => gameData.ships.removeShip(ship));
    };
  }, [faction.name, faction.ships, gameData]);

  return (
    <Container>
      <GridContainer onClick={onClick}>
        <ImageContainer src={faction.logo} />
        <div>
          <TooltipHeader>{faction.name.toUpperCase()}</TooltipHeader>
          <DescriptionContainer>{faction.description}</DescriptionContainer>
        </div>
      </GridContainer>
      {isOpen && (
        <ShipList>
          {ships.map((ship) => (
            <ShipCard
              key={`shipcard-${ship.shipModel}`}
              ship={ship}
              size={200}
            />
          ))}
        </ShipList>
      )}
    </Container>
  );
};
