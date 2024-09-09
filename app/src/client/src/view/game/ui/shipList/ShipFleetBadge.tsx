import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import ShipName from "../ShipName";
import {
  TooltipContainer,
  TooltipHeader,
  TooltipValueHeader,
  colors,
} from "../../../../styled";
import { useShipsBasicState } from "../../../../state/useShipBasicState";
import { useShip } from "../../../../state/useShip";
import { useUiStateHandler } from "../../../../state/useUIStateHandler";

type ContainerProps = {
  $isMine: boolean;
  $isSelected: boolean;
};

const Container = styled(TooltipContainer)<ContainerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 200px;
  box-sizing: border-box;
  text-align: left;
  margin-top: 5px;
  cursor: pointer;

  &:hover {
    border: 1px solid
      ${(props) => (props.$isMine ? colors.lightBlue : colors.textDanger)};
  }

  &:first-child {
    margin-top: 0;
  }

  ${(props) =>
    props.$isSelected &&
    `background-color: ${colors.mediumBlue}; border: 1px solid ${colors.lightBlue};`}
`;

const Header = styled(TooltipHeader)`
  border-bottom: none;
`;

const Fleet = styled(TooltipValueHeader)`
  padding-left: 8px;
`;

const ShipFleetBadge: React.FC<{ shipId: string }> = ({ shipId }) => {
  const data = useShipsBasicState(shipId);
  const uiState = useUiStateHandler();
  const ship = useShip(shipId);

  const scrollToShip = useCallback(() => {
    if (!ship) {
      return;
    }

    const { gameCamera, shipIconContainer } = uiState.getServices();
    const icon = shipIconContainer.getByShip(ship);
    gameCamera.setByLookAtPosition(icon.getPosition());
    uiState.customEvent("shipClicked", { entity: icon });
  }, [ship, uiState]);

  const mouseOver = useCallback(() => {
    if (!ship) {
      return;
    }
    const { shipIconContainer } = uiState.getServices();
    const icon = shipIconContainer.getByShip(ship);
    uiState.customEvent("mouseOverShip", { entity: icon });
  }, [ship, uiState]);

  const mouseOut = useCallback(() => {
    if (!ship) {
      return;
    }
    const { shipIconContainer } = uiState.getServices();
    const icon = shipIconContainer.getByShip(ship);
    uiState.customEvent("mouseOutShip", { entity: icon });
  }, [ship, uiState]);

  const Component = useMemo(() => {
    if (data?.isMine === undefined) {
      return null;
    }

    return (
      <Container
        $isMine={data.isMine}
        onClick={scrollToShip}
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
        $isSelected={data.isSelected}
      >
        <Header>
          <ShipName shipName={data.shipName} isMine={data.isMine} />
        </Header>
        <Fleet>Second fleet</Fleet>
      </Container>
    );
  }, [
    data?.isMine,
    data?.isSelected,
    data?.shipName,
    mouseOut,
    mouseOver,
    scrollToShip,
  ]);

  return Component;
};

export default ShipFleetBadge;
