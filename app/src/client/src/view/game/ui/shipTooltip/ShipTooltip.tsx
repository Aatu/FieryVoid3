import * as React from "react";
import styled from "styled-components";
import ShipWindow from "../shipWindow/ShipWindow";
import WeaponTargetingList from "./WeaponTargetingList";
import { Tooltip, TooltipHeader, TooltipEntry } from "../../../../styled";
import TorpedoAttack from "./TorpedoAttack";
import ShipTooltipDetails from "./ShipTooltipDetails";
import GameShipTooltipMenuBack from "./GameShipTooltipMenuBack";
import TorpedoDefense from "./TorpedoDefense";
import ShipName from "../ShipName";
import GameShipTooltipMenuTorpedoDefense from "./GameShipTooltipMenuTorpedoDefense";
import { CloseButton } from "../../../../styled/Button";
import UIState, { TooltipCcomponentProvider } from "../UIState";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { useUser } from "../../../../state/userHooks";

const InfoHeader = styled(TooltipHeader)`
  display: flex;
  justify-content: space-between;
`;

type ShipTooltipContainerProps = {
  right?: boolean;
  interactable?: boolean;
};

const ShipTooltipContainer = styled(Tooltip)<ShipTooltipContainerProps>`
  width: 315px;
  text-align: left;
  opacity: 0.95;
  position: absolute;
  top: 50px;
  ${(props) => (props.right ? "right: 220px;" : "left: 220px;")}

  ${(props) => (props.interactable ? "z-index: 4;" : "z-index: 1;")}
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

export enum TOOLTIP_TAB {
  TORPEDO_ATTACK = "tooltip_tab_torpedo_attack",
  TORPEDO_DEFENSE = "tooltip_tab_torpedo_defense",
}

type Props = {
  ui: boolean;
  shipTooltipMenuProvider: TooltipCcomponentProvider;
  ship: Ship;
  uiState: UIState;
  className?: string;
  right?: boolean;
};

const ShipTooltip: React.FC<Props> = ({
  ui,
  shipTooltipMenuProvider,
  ship,
  uiState,
  className,
  ...rest
}) => {
  const [tooltipTab, setTooltipTab] = React.useState<TOOLTIP_TAB | null>(null);
  const { data: currentUser } = useUser();

  const getMenu = () => {
    const newTooltipTab = getTooltipTab();

    if (!newTooltipTab) {
      const Menu =
        ui && shipTooltipMenuProvider ? shipTooltipMenuProvider() : null;
      return Menu;
    }

    if (newTooltipTab && ui) {
      if (newTooltipTab === TOOLTIP_TAB.TORPEDO_DEFENSE) {
        return GameShipTooltipMenuTorpedoDefense;
      }
      return GameShipTooltipMenuBack;
    }

    return null;
  };

  const getTabHeader = () => {
    switch (tooltipTab) {
      case TOOLTIP_TAB.TORPEDO_ATTACK:
        return "Weapon assignment";
      case TOOLTIP_TAB.TORPEDO_DEFENSE:
        return "Torpedo defense";
      default:
        return "Ship details";
    }
  };

  const getTooltipTab = () => {
    const myShip = ship.player.isUsers(currentUser || null);

    if (tooltipTab === TOOLTIP_TAB.TORPEDO_ATTACK && myShip) {
      return null;
    }

    return tooltipTab;
  };

  const tooltipTabActual = getTooltipTab();

  const Menu = getMenu();
  const interactable = Boolean(Menu || tooltipTab);

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
          {getTabHeader()}{" "}
          <CloseButton
            onClick={() => {
              uiState.hideShipTooltip(ship);
              uiState.customEvent("shipTooltipClosed", ship);
            }}
          />
        </div>
      </InfoHeader>
      {Menu && (
        <Menu
          uiState={uiState}
          ship={ship}
          selectTooltipTab={(tab: TOOLTIP_TAB) => setTooltipTab(tab)}
          {...rest}
        />
      )}
      {!tooltipTabActual && (
        <>
          {Menu && (
            <WeaponTargetingList uiState={uiState} ship={ship} {...rest} />
          )}
          <ShipTooltipDetails ship={ship} />
          <ShipWindow ship={ship} uiState={uiState} {...rest} />
        </>
      )}

      {tooltipTabActual === TOOLTIP_TAB.TORPEDO_ATTACK && (
        <TorpedoAttack ship={ship} uiState={uiState} {...rest} />
      )}

      {tooltipTabActual === TOOLTIP_TAB.TORPEDO_DEFENSE && (
        <TorpedoDefense ship={ship} uiState={uiState} {...rest} />
      )}
    </ShipTooltipContainer>
  );
};

export default ShipTooltip;
