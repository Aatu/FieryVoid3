import * as React from "react";
import styled from "styled-components";
import GamePositionComponent from "../GamePositionComponent";
import ShipWindow from "../shipWindow/ShipWindow";
import WeaponTargetingList from "./WeaponTargetingList";
import {
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  colors
} from "../../../../styled";

const InfoHeader = styled(TooltipHeader)`
  font-size: 12px;
`;

const ShipTooltipContainer = styled(Tooltip)`
  width: 300px;
  text-align: left;
  opacity: 0.95;
  position: relative;
  ${props => (props.interactable ? "z-index: 4;" : "z-index: 1;")}
`;

export const Entry = styled(TooltipEntry)`
  text-align: left;
  color: #5e85bc;
  font-family: arial;
  font-size: 11px;
`;

export const Header = styled.span`
  color: white;
`;

const InfoValue = styled.span`
  color: ${colors.lightBlue};
`;

class ShipTooltip extends React.Component {
  render() {
    const {
      ship,
      getPosition,
      uiState,
      ui,
      shipTooltipMenuProvider,
      ...rest
    } = this.props;

    const Menu =
      ui && shipTooltipMenuProvider ? shipTooltipMenuProvider() : null;

    return (
      <GamePositionComponent
        getPosition={getPosition}
        uiState={uiState}
        marginTop={20}
        marginLeft={-150}
      >
        <ShipTooltipContainer interactable={Boolean(Menu)}>
          <InfoHeader>{ship.name}</InfoHeader>
          {Menu && <Menu uiState={uiState} ship={ship} {...rest} />}
          <WeaponTargetingList uiState={uiState} ship={ship} {...rest} />
          <ShipWindow ship={ship} uiState={uiState} {...rest} />
        </ShipTooltipContainer>
      </GamePositionComponent>
    );
  }
}

export default ShipTooltip;
