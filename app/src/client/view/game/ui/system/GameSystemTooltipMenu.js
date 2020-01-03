import * as React from "react";
import { TooltipMenu, TooltipButton, TooltipValue } from "../../../../styled";
import OEWButtons from "../electronicWarfare/OEWButtons";

class GameSystemTooltipMenu extends React.PureComponent {
  render() {
    const { ship, system, uiState } = this.props;
    const { currentUser } = uiState.services;

    const myShip = ship.player.is(currentUser);
    const selectedShip = uiState.getSelectedShip();

    return (
      <TooltipMenu>
        {myShip && ship.systems.power.canSetOnline(system) && (
          <TooltipButton
            img="/img/goOnline.png"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              system.power.setOnline();
              uiState.shipSystemStateChanged(ship, system);
              uiState.shipStateChanged(ship);
              this.forceUpdate();
            }}
          />
        )}

        {myShip && ship.systems.power.canSetOffline(system) && (
          <TooltipButton
            img="/img/goOffline.png"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              system.power.setOffline();
              uiState.shipSystemStateChanged(ship, system);
              uiState.shipStateChanged(ship);
              this.forceUpdate();
            }}
          />
        )}

        {myShip &&
          !system.isDisabled() &&
          system.callHandler("isBoostable", null, false) && (
            <TooltipButton
              img="/img/plus.png"
              disabled={!system.callHandler("canBoost", null, false)}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if ((!system.callHandler("canBoost"), null, false)) {
                  return;
                }

                system.callHandler("boost");
                uiState.shipSystemStateChanged(ship, system);
                uiState.shipStateChanged(ship);
                this.forceUpdate();
              }}
            />
          )}

        {myShip &&
          !system.isDisabled() &&
          system.callHandler("isBoostable", null, false) && (
            <TooltipButton
              img="/img/minus.png"
              disabled={!system.callHandler("canDeBoost", null, false)}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (!system.callHandler("canDeBoost", null, false)) {
                  return;
                }
                system.callHandler("deBoost");
                uiState.shipSystemStateChanged(ship, system);
                uiState.shipStateChanged(ship);
                this.forceUpdate();
              }}
            />
          )}

        {system
          .callHandler("getTooltipMenuButton", { uiState }, [])
          .map(({ img, disabledHandler, onClickHandler }, i) => (
            <TooltipButton
              key={`custom-system-tooltip-button-${i}`}
              img={img}
              disabled={disabledHandler}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onClickHandler();
                uiState.shipSystemStateChanged(ship, system);
                uiState.shipStateChanged(ship);
                this.forceUpdate();
              }}
            />
          ))}
      </TooltipMenu>
    );
  }
}

export default GameSystemTooltipMenu;
