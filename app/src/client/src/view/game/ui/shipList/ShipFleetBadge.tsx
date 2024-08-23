import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import ShipName from "../ShipName";
import {
  TooltipContainer,
  TooltipHeader,
  TooltipValueHeader,
  colors,
} from "../../../../styled";
import UIState from "../UIState";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { useUser } from "../../../../state/userHooks";

type ContainerProps = {
  isMine: boolean;
  isSelected: boolean;
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

  :hover {
    border: 1px solid
      ${(props) => (props.isMine ? colors.lightBlue : colors.textDanger)};
  }

  &:first-child {
    margin-top: 0;
  }

  ${(props) =>
    props.isSelected &&
    `background-color: ${colors.mediumBlue}; border: 1px solid ${colors.lightBlue};`}
`;

const Header = styled(TooltipHeader)`
  border-bottom: none;
`;

const Fleet = styled(TooltipValueHeader)`
  padding-left: 8px;
`;

const ShipFleetBadge: React.FC<{ ship: Ship; uiState: UIState }> = ({
  ship,
  uiState,
}) => {
  const { data: currentUser } = useUser();

  const isMine = ship.player.isUsers(currentUser || null);

  const selectedShip = uiState.getSelectedShip();
  const isSelected = selectedShip && selectedShip.id === ship.id;

  const scrollToShip = useCallback(() => {
    const { gameCamera, shipIconContainer } = uiState.getServices();
    const icon = shipIconContainer.getByShip(ship);
    gameCamera.setByLookAtPosition(icon.getPosition());
    uiState.customEvent("shipClicked", { entity: icon });
  }, [ship, uiState]);

  const mouseOver = useCallback(() => {
    const { shipIconContainer } = uiState.getServices();
    const icon = shipIconContainer.getByShip(ship);
    uiState.customEvent("mouseOverShip", { entity: icon });
  }, [ship, uiState]);

  const mouseOut = useCallback(() => {
    const { shipIconContainer } = uiState.getServices();
    const icon = shipIconContainer.getByShip(ship);
    uiState.customEvent("mouseOutShip", { entity: icon });
  }, [ship, uiState]);

  const shipName = ship.name;

  const Component = useMemo(() => {
    return (
      <Container
        isMine={isMine}
        onClick={scrollToShip}
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
        isSelected={Boolean(isSelected)}
      >
        <Header>
          <ShipName shipName={shipName} isMine={isMine} />
        </Header>
        <Fleet>Second fleet</Fleet>
      </Container>
    );
  }, [isMine, isSelected, mouseOut, mouseOver, scrollToShip, shipName]);

  return Component;
};

export default ShipFleetBadge;
