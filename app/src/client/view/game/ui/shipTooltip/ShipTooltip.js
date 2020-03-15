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
  TooltipValueHeader,
  TooltipButton
} from "../../../../styled";
import TorpedoAttack from "./TorpedoAttack";
import ShipTooltipDetails from "./ShipTooltipDetails";
import { X } from "../../../../styled/icon";
import GameShipTooltipMenuBack from "./GameShipTooltipMenuBack";
import TorpedoDefense from "./TorpedoDefense";
import ShipName from "../ShipName";

const InfoHeader = styled(TooltipHeader)`
  display: flex;
  justify-content: space-between;
`;

const ShipTooltipContainer = styled(Tooltip)`
  width: 315px;
  text-align: left;
  opacity: 0.95;
  position: absolute;
  top: 50px;
  ${props => (props.right ? "right: 220px;" : "left: 220px;")}

  ${props => (props.interactable ? "z-index: 4;" : "z-index: 4;")}
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

const CloseButton = styled(TooltipButton)`
  height: 10px;
  width: 10px;
  padding: 0;
  margin-left: 5px;

  & svg {
    width: 100%;
    height: 100%;
  }
`;

export const TOOLTIP_TAB_TORPEDO_ATTACK = "tooltip_tab_torpedo_attack";
export const TOOLTIP_TAB_TORPEDO_DEFENSE = "tooltip_tab_torpedo_defense";

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

    if (tooltipTab && ui) {
      return GameShipTooltipMenuBack;
    }

    return null;
  }

  getTabHeader() {
    const { tooltipTab } = this.state;

    switch (tooltipTab) {
      case TOOLTIP_TAB_TORPEDO_ATTACK:
        return "Weapon assignment";
      case TOOLTIP_TAB_TORPEDO_DEFENSE:
        return "Torpedo defense";
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

    return (
      <ShipTooltipContainer
        right={rest.right}
        className={className}
        interactable={interactable}
      >
        <InfoHeader>
          <div>
            <ShipName ship={ship} />
          </div>{" "}
          <div>
            {this.getTabHeader()}{" "}
            <CloseButton
              onClick={() => {
                uiState.hideShipTooltip(ship);
                uiState.customEvent("shipTooltipClosed", ship);
              }}
            >
              <X />
            </CloseButton>
          </div>
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

        {tooltipTab === TOOLTIP_TAB_TORPEDO_DEFENSE && (
          <TorpedoDefense ship={ship} uiState={uiState} {...rest} />
        )}
      </ShipTooltipContainer>
    );
  }
}

export default ShipTooltip;
