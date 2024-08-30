import * as React from "react";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import OEWButtons from "../electronicWarfare/OEWButtons";
import { TOOLTIP_TAB } from "./ShipTooltip";
import CCEWButtons from "../electronicWarfare/CCEWButtons";
import { useUser } from "../../../../state/userHooks";
import UIState from "../UIState";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { useForceRerender } from "../../../../util/useForceRerender";
import { SYSTEM_HANDLERS } from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";

const toggleRadiators = (ship: Ship, uiState: UIState, on: boolean = false) => {
  ship.systems
    .getSystems()
    .filter((system) => !system.isDestroyed())
    .filter((system) =>
      system.callHandler(SYSTEM_HANDLERS.isRadiator, null, false)
    )
    .filter((system) => {
      if (on) {
        return system.power.canSetOnline();
      } else {
        return system.power.canSetOffline();
      }
    })
    .forEach((system) => {
      if (on) {
        system.power.setOnline();
      } else {
        system.power.setOffline();
      }

      uiState.shipSystemStateChanged(ship, system);
    });
};

const hasRadiators = (ship: Ship) =>
  ship.systems
    .getSystems()
    .filter((system) => !system.isDestroyed())
    .filter((system) =>
      system.callHandler(SYSTEM_HANDLERS.isRadiator, null, false)
    ).length > 0;

const hasOnlineradiators = (ship: Ship) =>
  ship.systems
    .getSystems()
    .filter((system) => !system.isDestroyed())
    .filter((system) =>
      system.callHandler(SYSTEM_HANDLERS.isRadiator, null, false)
    )
    .filter((system) => system.power.canSetOffline())
    .filter((system) => system.power.isOnline()).length > 0;

const toggleInterceptors = (
  ship: Ship,
  uiState: UIState,
  on: boolean = false
) => {
  ship.systems
    .getSystems()
    .filter((system) => !system.isDestroyed())
    .filter((system) =>
      system.callHandler(SYSTEM_HANDLERS.canIntercept, null, false)
    )
    .filter((system) => {
      if (on) {
        return system.power.canSetOnline();
      } else {
        return system.power.canSetOffline();
      }
    })
    .forEach((system) => {
      if (on) {
        system.power.setOnline();
      } else {
        system.power.setOffline();
      }

      uiState.shipSystemStateChanged(ship, system);
    });
};

const hasInterceptors = (ship: Ship) =>
  ship.systems
    .getSystems()
    .filter((system) => !system.isDestroyed())
    .filter((system) =>
      system.callHandler(SYSTEM_HANDLERS.canIntercept, null, false)
    ).length > 0;

const hasOnlineInterceptors = (ship: Ship) =>
  ship.systems
    .getSystems()
    .filter((system) => !system.isDestroyed())
    .filter((system) =>
      system.callHandler(SYSTEM_HANDLERS.canIntercept, null, false)
    )
    .filter((system) => system.power.canSetOffline())
    .filter((system) => system.power.isOnline()).length > 0;

type Props = {
  ship: Ship;
  uiState: UIState;
  selectTooltipTab: (tab: TOOLTIP_TAB) => void;
};

const GameShipTooltipMenu: React.FC<Props> = ({
  ship,
  uiState,
  selectTooltipTab,
}) => {
  const { data: currentUser } = useUser();
  const rerender = useForceRerender();

  const selectedShip = uiState.getSelectedShip();

  return (
    <TooltipMenu>
      {ship.player.isUsers(currentUser || null) &&
        !uiState.isSelected(ship) && (
          <TooltipButton
            $img="/img/selectShip.png"
            onClick={() => uiState.selectShip(ship)}
          />
        )}

      {ship.player.isUsers(currentUser || null) && selectedShip && (
        <CCEWButtons
          ship={ship}
          uiState={uiState}
          ccew={selectedShip.electronicWarfare.getCcEw()}
        />
      )}

      {!ship.player.isUsers(currentUser || null) && selectedShip && (
        <OEWButtons
          ship={selectedShip}
          target={ship}
          uiState={uiState}
          oew={selectedShip.electronicWarfare.getOffensiveEw(ship)}
        />
      )}

      {ship.player.isUsers(currentUser || null) && hasRadiators(ship) && (
        <TooltipButton
          $img="/img/system/radiator.png"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            toggleRadiators(
              ship,
              uiState,
              hasOnlineradiators(ship) ? false : true
            );
            uiState.shipStateChanged(ship);
            rerender();
          }}
        />
      )}

      {ship.player.isUsers(currentUser || null) && hasInterceptors(ship) && (
        <TooltipButton
          $img="/img/system/gatlingPulseCannon.png"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            toggleInterceptors(
              ship,
              uiState,
              hasOnlineInterceptors(ship) ? false : true
            );
            uiState.shipStateChanged(ship);
            rerender();
          }}
        />
      )}

      {!ship.player.isUsers(currentUser || null) && (
        <TooltipButton
          $img="/img/system/missile1.png"
          onClick={() => selectTooltipTab(TOOLTIP_TAB.TORPEDO_ATTACK)}
        />
      )}

      {ship.player.isUsers(currentUser || null) && (
        <TooltipButton
          $img="/img/torpedoDefense.png"
          onClick={() => selectTooltipTab(TOOLTIP_TAB.TORPEDO_DEFENSE)}
        />
      )}
    </TooltipMenu>
  );
};

export default GameShipTooltipMenu;
