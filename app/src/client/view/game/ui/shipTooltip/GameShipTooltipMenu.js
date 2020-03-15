import * as React from "react";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import OEWButtons from "../electronicWarfare/OEWButtons";
import {
  TOOLTIP_TAB_TORPEDO_ATTACK,
  TOOLTIP_TAB_TORPEDO_DEFENSE
} from "./ShipTooltip";
import CCEWButtons from "../electronicWarfare/CCEWButtons";

const toggleRadiators = (ship, uiState, on = false) => {
  ship.systems
    .getSystems()
    .filter(system => !system.isDestroyed())
    .filter(system => system.callHandler("isRadiator", null, false))
    .filter(system => {
      if (on) {
        return system.power.canSetOnline();
      } else {
        return system.power.canSetOffline();
      }
    })
    .forEach(system => {
      if (on) {
        system.power.setOnline();
      } else {
        system.power.setOffline();
      }

      uiState.shipSystemStateChanged(ship, system);
    });
};

const hasRadiators = ship =>
  ship.systems
    .getSystems()
    .filter(system => !system.isDestroyed())
    .filter(system => system.callHandler("isRadiator", null, false)).length > 0;

const hasOnlineradiators = ship =>
  ship.systems
    .getSystems()
    .filter(system => !system.isDestroyed())
    .filter(system => system.callHandler("isRadiator", null, false))
    .filter(system => system.power.canSetOffline())
    .filter(system => system.power.isOnline()).length > 0;

const toggleInterceptors = (ship, uiState, on = false) => {
  ship.systems
    .getSystems()
    .filter(system => !system.isDestroyed())
    .filter(system => system.callHandler("canIntercept", null, false))
    .filter(system => {
      if (on) {
        return system.power.canSetOnline();
      } else {
        return system.power.canSetOffline();
      }
    })
    .forEach(system => {
      if (on) {
        system.power.setOnline();
      } else {
        system.power.setOffline();
      }

      uiState.shipSystemStateChanged(ship, system);
    });
};

const hasInterceptors = ship =>
  ship.systems
    .getSystems()
    .filter(system => !system.isDestroyed())
    .filter(system => system.callHandler("canIntercept", null, false)).length >
  0;

const hasOnlineInterceptors = ship =>
  ship.systems
    .getSystems()
    .filter(system => !system.isDestroyed())
    .filter(system => system.callHandler("canIntercept", null, false))
    .filter(system => system.power.canSetOffline())
    .filter(system => system.power.isOnline()).length > 0;

class GameShipTooltipMenu extends React.PureComponent {
  render() {
    const { ship, uiState, selectTooltipTab } = this.props;
    const { currentUser } = uiState.services;

    const selectedShip = uiState.getSelectedShip();

    return (
      <TooltipMenu>
        {ship.player.isUsers(currentUser) && !uiState.isSelected(ship) && (
          <TooltipButton
            img="/img/selectShip.png"
            onClick={() => uiState.selectShip(ship)}
          />
        )}

        {ship.player.isUsers(currentUser) && (
          <CCEWButtons
            ship={ship}
            uiState={uiState}
            ccew={selectedShip.electronicWarfare.getCcEw()}
          />
        )}

        {!ship.player.isUsers(currentUser) && selectedShip && (
          <OEWButtons
            ship={selectedShip}
            target={ship}
            uiState={uiState}
            oew={selectedShip.electronicWarfare.getOffensiveEw(ship)}
          />
        )}

        {ship.player.isUsers(currentUser) && hasRadiators(ship) && (
          <TooltipButton
            img="/img/system/radiator.png"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              toggleRadiators(
                ship,
                uiState,
                hasOnlineradiators(ship) ? false : true
              );
              uiState.shipStateChanged(ship);
              this.forceUpdate();
            }}
          />
        )}

        {ship.player.isUsers(currentUser) && hasInterceptors(ship) && (
          <TooltipButton
            img="/img/system/gatlingPulseCannon.png"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              toggleInterceptors(
                ship,
                uiState,
                hasOnlineInterceptors(ship) ? false : true
              );
              uiState.shipStateChanged(ship);
              this.forceUpdate();
            }}
          />
        )}

        {!ship.player.isUsers(currentUser) && (
          <TooltipButton
            img="/img/system/missile1.png"
            onClick={() => selectTooltipTab(TOOLTIP_TAB_TORPEDO_ATTACK)}
          />
        )}

        {ship.player.isUsers(currentUser) && (
          <TooltipButton
            img="/img/torpedoDefense.png"
            onClick={() => selectTooltipTab(TOOLTIP_TAB_TORPEDO_DEFENSE)}
          />
        )}
      </TooltipMenu>
    );
  }
}

export default GameShipTooltipMenu;
