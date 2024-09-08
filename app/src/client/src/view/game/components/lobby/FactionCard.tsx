import React, { useMemo } from "react";
import {
  Section,
  SubTitle,
  Button,
  Value,
  TooltipHeader,
  colors,
  Clickable,
} from "../../../../styled";
import UIState from "../../ui/UIState";
import ships from "@fieryvoid3/model/src/unit/ships";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { Faction } from "@fieryvoid3/model/src/unit/ships/factions";
import styled from "styled-components";
import { ClickableProps } from "../../../../styled/Clickable";
import { createShipInstance } from "@fieryvoid3/model/src/unit/createShipObject";

const ImageContainer = styled.img`
  border-right: 1px solid #aaaaaa;
  width: 100px;
  height: 100px;
  background-color: black;
  padding: 8px;
`;

const Container = styled.div<ClickableProps>`
  border: 1px solid #aaaaaa;
  display: grid;
  grid-template-columns: 116px auto;
  cursor: pointer;

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
`;

const DescriptionContainer = styled.div`
  text-align: left;
  padding: 3px 8px 6px 8px;
  color: ${colors.lightBlue};
`;

type Props = {
  faction: Faction;
  uiState: UIState;
  isOpen?: boolean;
};

export const FactionCard: React.FC<Props> = ({ uiState, faction, isOpen }) => {
  const openShipWindow = (ship: Ship) => {
    return () => {
      uiState.showShipTooltip(ship, true, true);
    };
  };

  const ships = useMemo(() => {
    return faction.ships.map((shipClass) => createShipInstance(shipClass));
  }, [faction.ships]);

  return (
    <Container>
      <ImageContainer src={faction.logo} />
      <div>
        <TooltipHeader>{faction.name.toUpperCase()}</TooltipHeader>
        <DescriptionContainer>{faction.description}</DescriptionContainer>
        <ShipList>
          {ships.map((ship) => (
            <ShipCard
              key={`shipcard-${ship.shipModel}`}
              ship={ship}
              uiState={uiState}
            />
          ))}
        </ShipList>
      </div>
    </Container>
  );
};
