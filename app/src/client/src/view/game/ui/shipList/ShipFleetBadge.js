import React, { useContext, useCallback, useMemo } from "react";
import styled from "styled-components";
import ShipName from "../ShipName";
import {
  TooltipContainer,
  TooltipHeader,
  TooltipValue,
  TooltipValueHeader,
  colors,
  TooltipButton
} from "../../../../styled";
import { StateStore } from "../../../../state/StoreProvider";

const Container = styled(TooltipContainer)`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 200px;
  box-sizing: border-box;
  text-align: left;
  margin-top: 5px;
  cursor: pointer;

  :hover {
    border: 1px solid
      ${props => (props.isMine ? colors.lightBlue : colors.textDanger)};
  }

  &:first-child {
    margin-top: 0;
  }

  ${props =>
    props.isSelected &&
    `background-color: ${colors.mediumBlue}; border: 1px solid ${colors.lightBlue};`}
`;

const Header = styled(TooltipHeader)`
  border-bottom: none;
`;

const Fleet = styled(TooltipValueHeader)`
  padding-left: 8px;
`;

export default function ShipFleetBadge({ ship, uiState }) {
  const { currentUser } = useContext(StateStore);

  const isMine = ship.player.isUsers(currentUser);

  const selectedShip = uiState.getSelectedShip();
  const isSelected = selectedShip && selectedShip.id === ship.id;

  const scrollToShip = useCallback(() => {
    const { gameCamera, shipIconContainer } = uiState.services;
    const icon = shipIconContainer.getByShip(ship);
    gameCamera.setByLookAtPosition(icon.getPosition());
    uiState.customEvent("shipClicked", { entity: icon });
  }, []);

  const mouseOver = useCallback(() => {
    const { shipIconContainer } = uiState.services;
    const icon = shipIconContainer.getByShip(ship);
    uiState.customEvent("mouseOverShip", { entity: icon });
  }, []);

  const mouseOut = useCallback(() => {
    const { shipIconContainer } = uiState.services;
    const icon = shipIconContainer.getByShip(ship);
    uiState.customEvent("mouseOutShip", { entity: icon });
  }, []);

  const Component = useMemo(() => {
    return (
      <Container
        isMine={isMine}
        onClick={scrollToShip}
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
        isSelected={isSelected}
      >
        <Header>
          <ShipName ship={ship} />
        </Header>
        <Fleet>Second fleet</Fleet>
      </Container>
    );
  }, [isSelected]);

  return Component;
}
