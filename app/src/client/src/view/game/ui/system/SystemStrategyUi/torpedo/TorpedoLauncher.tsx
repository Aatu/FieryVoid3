import React, { MouseEventHandler, useEffect } from "react";

import {
  IconAndLabel,
  TooltipHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  InlineTooltipEntry,
} from "../../../../../../styled";
import styled from "styled-components";
import CargoItem from "../cargo/CargoItem";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import TorpedoLauncherStrategy from "@fieryvoid3/model/src/unit/system/strategy/weapon/TorpedoLauncherStrategy";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import { useForceRerender } from "../../../../../../util/useForceRerender";
import { useUiStateHandler } from "../../../../../../state/useUIStateHandler";
import Torpedo from "@fieryvoid3/model/src/unit/system/weapon/ammunition/torpedo/Torpedo";
import NoAmmunitionLoaded from "@fieryvoid3/model/src/unit/system/weapon/ammunition/NoAmmunitionLoaded";

const TorpedoList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

type TorpedoCargoItemProps = {
  target: unknown;
};

const TorpedoCargoItem = styled(CargoItem)<TorpedoCargoItemProps>`
  ${IconAndLabel} {
    ${(props) => {
      const { target } = props;

      if (target) {
        return "filter: hue-rotate(0deg) brightness(4) grayscale(0);";
      }
    }}
  }
`;

export type TorpedoLauncherProps = {
  ship: Ship;
  launcher: TorpedoLauncherStrategy;
  loadedTorpedo: Torpedo;
  launcherIndex: number;
  loadingTime: number;
  turnsLoaded: number;
};

const TorpedoLauncher: React.FC<TorpedoLauncherProps> = ({
  ship,
  launcher,
  loadedTorpedo,
  launcherIndex,
  loadingTime,
  turnsLoaded,
}) => {
  const rerender = useForceRerender();
  const uiState = useUiStateHandler();

  useEffect(() => {
    const systemChangedCallback = (newShip: Ship, newSystem: ShipSystem) => {
      if (ship.id === newShip.id && launcher.getSystem().id === newSystem.id) {
        rerender();
      }
    };

    uiState.subscribeToSystemChange(systemChangedCallback);

    return () => {
      uiState.unsubscribeFromSystemChange(systemChangedCallback);
    };
  }, [launcher, rerender, ship.id, uiState]);

  const unloadAmmo: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    launcher.unloadAmmo({ launcherIndex });
    uiState.shipSystemStateChanged(ship, launcher.getSystem());
  };

  const loadTorpedo =
    (torpedo: Torpedo): MouseEventHandler<HTMLDivElement> =>
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      launcher.loadAmmo({ ammo: torpedo, launcherIndex });
      uiState.shipSystemStateChanged(ship, launcher.getSystem());
    };

  const torpedoMouseOut = (ship: Ship, torpedo: Torpedo) => () => {
    uiState.customEvent("torpedoMouseOut", {
      ship,
      torpedo,
    });
  };

  const torpedoMouseOver = (ship: Ship, torpedo: Torpedo) => () => {
    uiState.customEvent("torpedoMouseOver", {
      ship,
      torpedo,
      target: getLoadedTorpedoTarget(),
    });
  };

  const getLoadedTorpedoTarget = () => {
    if (!loadedTorpedo) {
      return null;
    }

    const targetId = launcher.launchTarget;

    if (!targetId) {
      return null;
    }

    return uiState.getGameData().ships.getShipById(targetId);
  };

  return (
    <>
      <TooltipHeader>Torpedo tube {launcherIndex}</TooltipHeader>
      <InlineTooltipEntry>
        <TooltipEntry>
          <TooltipValueHeader>Loading: </TooltipValueHeader>
          <TooltipValue>{`${turnsLoaded}/${loadingTime}`}</TooltipValue>
        </TooltipEntry>

        <InlineTooltipEntry>
          <TooltipValueHeader>Loaded torpedo:</TooltipValueHeader>
          <TorpedoCargoItem
            cargo={loadedTorpedo ? loadedTorpedo : new NoAmmunitionLoaded()}
            target={getLoadedTorpedoTarget()}
            handleMouseOver={torpedoMouseOver(ship, loadedTorpedo).bind(this)}
            handleMouseOut={torpedoMouseOut(ship, loadedTorpedo).bind(this)}
          />
        </InlineTooltipEntry>
      </InlineTooltipEntry>

      <TooltipEntry>
        <TooltipValueHeader>Select torpedo to load: </TooltipValueHeader>
      </TooltipEntry>

      <TorpedoList>
        {launcher.getPossibleTorpedosToLoad().map(({ object, amount }, i) => (
          <CargoItem
            handleOnClick={loadTorpedo(object)}
            key={`torpedo-launcer-${i}-possible-torpedo-${object.constructor.name}`}
            cargo={object}
            amount={amount}
            handleMouseOver={torpedoMouseOver(launcher.getShip(), object)}
            handleMouseOut={torpedoMouseOut(launcher.getShip(), object)}
          />
        ))}
        {loadedTorpedo && (
          <CargoItem
            handleOnClick={unloadAmmo}
            key={`torpedo-launcer-unload`}
            cargo={new NoAmmunitionLoaded()}
          />
        )}
      </TorpedoList>
    </>
  );
};

export default TorpedoLauncher;
