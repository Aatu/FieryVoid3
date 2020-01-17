import * as React from "react";
import styled from "styled-components";
import GamePositionComponent from "../GamePositionComponent";
import ShipWindow from "../shipWindow/ShipWindow";
import WeaponTargetingList from "./WeaponTargetingList";
import {
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  TooltipValue,
  TooltipValueHeader
} from "../../../../styled";
import TorpedoAttack from "./TorpedoAttack";
import ShipTooltipDetails from "./ShipTooltipDetails";

const InfoHeader = styled(TooltipHeader)`
  display: flex;
  justify-content: space-between;
`;

const ShipTooltipContainer = styled(Tooltip)`
  width: 315px;
  text-align: left;
  opacity: 0.95;
  position: absolute;
  top: 10px;
  right: 10px;
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

export const TOOLTIP_TAB_TORPEDO_ATTACK = "toolti_tab_torpedo_attack";

class ShipTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tooltipTab: null };
  }

  selectTooltipTab(name) {
    this.setState({ tooltipTab: name });
  }

  getMenu() {
    const { ui, shipTooltipMenuProvider } = this.props;

    const tooltipTab = this.getTooltipTab();

    if (!tooltipTab) {
      const Menu =
        ui && shipTooltipMenuProvider ? shipTooltipMenuProvider() : null;
      return Menu;
    }

    return null;
  }

  getTabHeader() {
    const { tooltipTab } = this.state;

    switch (tooltipTab) {
      case TOOLTIP_TAB_TORPEDO_ATTACK:
        return "Torpedo attack";
      default:
        return "Ship details";
    }
  }

  getTooltipTab() {
    const { ship, uiState } = this.props;
    const { tooltipTab } = this.state;
    const { currentUser } = uiState.services;

    const myShip = ship.player.isUsers(currentUser);

    if (tooltipTab === TOOLTIP_TAB_TORPEDO_ATTACK && myShip) {
      return null;
    }

    return tooltipTab;
  }

  render() {
    const {
      ship,
      getPosition,
      uiState,
      ui,
      shipTooltipMenuProvider,
      className,
      ...rest
    } = this.props;

    const tooltipTab = this.getTooltipTab();

    const Menu = this.getMenu();
    const interactable = Boolean(Menu) || tooltipTab;

    /*
    <GamePositionComponent
        getPosition={getPosition}
        uiState={uiState}
        marginTop={20}
        marginLeft={-150}
      >
      */

    return (
      <ShipTooltipContainer className={className} interactable={interactable}>
        <InfoHeader>
          <div>{ship.name}</div> <div>{this.getTabHeader()}</div>
        </InfoHeader>
        {Menu && (
          <Menu
            uiState={uiState}
            ship={ship}
            selectTooltipTab={this.selectTooltipTab.bind(this)}
            {...rest}
          />
        )}
        {!tooltipTab && (
          <>
            {Menu && (
              <WeaponTargetingList uiState={uiState} ship={ship} {...rest} />
            )}
            <ShipTooltipDetails ship={ship} uiState={uiState} />
            <ShipWindow ship={ship} uiState={uiState} {...rest} />
          </>
        )}

        {tooltipTab === TOOLTIP_TAB_TORPEDO_ATTACK && (
          <TorpedoAttack ship={ship} uiState={uiState} {...rest} />
        )}
      </ShipTooltipContainer>
    );
  }
}

export default ShipTooltip;
