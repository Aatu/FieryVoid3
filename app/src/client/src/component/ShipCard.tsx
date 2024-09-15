import Ship from "@fieryvoid3/model/src/unit/Ship";
import styled from "styled-components";
import { StaticShipViewComponent } from "./ShipView/StaticShipViewComponent";
import { useUiStateHandler } from "../state/useUIStateHandler";
import { TooltipButton } from "../styled";
import { MouseEventHandler, useCallback } from "react";

type Props = {
  ship: Ship;
  size: number;
  buyShip?: (ship: Ship) => void;
};

const Container = styled.div`
  border: 1px solid #aaaaaa;
  position: relative;
`;

const AddToFleetButton = styled(TooltipButton)`
  position: absolute;
  right: 4px;
  top: 4px;
`;

const NameContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  height: 40px;
  padding: 0 8px;
  opacity: 0.85;
`;

export const ShipCard: React.FC<Props> = ({ ship, size, buyShip }) => {
  const uiState = useUiStateHandler();

  const buyShipCallback: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (buyShip) {
        buyShip(ship);
      }
    },
    [buyShip, ship]
  );

  return (
    <Container
      onClick={() => {
        uiState.hideAllShipTooltips();
        uiState.showShipTooltip(ship, true, true);
      }}
    >
      <StaticShipViewComponent ship={ship} size={size} />
      <NameContainer>{ship.shipTypeName}</NameContainer>
      {buyShip && (
        <AddToFleetButton $img="/img/plus.png" onClick={buyShipCallback} />
      )}
    </Container>
  );
};
