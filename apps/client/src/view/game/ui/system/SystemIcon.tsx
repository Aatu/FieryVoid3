import styled from "styled-components";
import SystemInfo from "./SystemInfo";

import { colors } from "../../../../styled";
import React, {
  LegacyRef,
  MouseEventHandler,
  useMemo,
  useRef,
  useState,
} from "react";
import { SystemMenuUiState } from "../UIState";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { SYSTEM_HANDLERS } from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";
import { useSystemMenu } from "../../../../state/useSystemMenu";
import { useUiStateHandler } from "../../../../state/useUIStateHandler";
import { useSystem } from "../../../../state/useSystem";
import WeaponFireService from "@fieryvoid3/model/src/weapon/WeaponFireService";

type HealthBarProps = {
  $destroyed?: boolean;
  $health: number;
  $criticals?: boolean;
};

const HealthBar = styled.div<HealthBarProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 7px;
  border: 2px solid black;
  box-sizing: border-box;

  ${(props) => props.$destroyed && "display: none;"}
  background-color: #7a2020;

  &:before {
    content: "";
    position: absolute;
    width: ${(props) => `${props.$health}%`};
    height: 100%;
    left: 0;
    bottom: 0;
    background-color: ${(props) =>
      props.$criticals ? colors.hitpointsCritical : colors.hitpoints};
  }
`;

type SystemTextProps = {
  $destroyed?: boolean;
};

const SystemText = styled.div<SystemTextProps>`
  position: absolute;
  top: 0px;
  width: 100%;
  height: calc(100% - 5px);
  font-family: arial;
  font-size: 10px;
  color: white;
  display: flex;
  ${(props) => props.$destroyed && "display: none;"}
  align-items: flex-end;
  justify-content: center;
  text-shadow: black 0 0 6px, black 0 0 6px, black 0 0 6px, black 0 0 6px;
  pointer-events: none;
`;

type SystemProps = {
  $background: string;
  $offline?: boolean;
  $loading?: boolean;
  $selected?: boolean;
  $firing?: boolean;
  $targeting?: boolean;
  $reserved?: boolean;
  $destroyed?: boolean;
  $inactive?: boolean;
  $boosted?: boolean;
};

const System = styled.div<SystemProps>`
  position: relative;
  box-sizing: border-box;
  width: 30px;
  height: 30px;

  background-color: "transparent";
  background-image: ${(props) => `url(${props.$background})`};
  background-size: cover;

  ${(props) => props.$selected && `animation: blinker 2s linear infinite;`};

  @keyframes blinker {
    50% {
      opacity: 0.3;
    }
  }

  filter: ${(props) => {
    if (props.$targeting) {
      return "hue-rotate(0deg) brightness(4) grayscale(0)";
    } else if (props.$reserved) {
      return "hue-rotate(0deg) brightness(1) grayscale(0.7)";
    } else if (props.$firing) {
      return "hue-rotate(0deg) brightness(4) grayscale(0)"; //"grayscale(100%) brightness(6) drop-shadow(0px 0px 5px white)";
    } else if (props.$destroyed) {
      return "blur(1px) brightness(0.5)";
    } else if (props.$inactive) {
      return "brightness(0.5)";
    } else if (props.$offline) {
      return "grayscale(1)";
    } else {
      return "none";
    }
  }};
  cursor: pointer;

  ${SystemText} {
    display: ${(props) => (props.$offline ? "none" : "flex")};
  }

  ${({ $boosted }) =>
    $boosted &&
    `
    :before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.95;
      background-image: url(/img/boosted.png);
    `}

  :before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: ${(props) => {
      if (props.$destroyed || props.$offline || props.$loading) {
        return "0.8";
      }

      return "0";
    }};

    background-color: transparent;

    background-image: ${(props) => {
      if (props.$offline) {
        return "url(/img/offline.png)";
      }

      return "none";
    }};
  }
`;

type OverheatProps = {
  $overheat: number;
};

const Overheat = styled.div<OverheatProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.95;
  background-image: url(/img/overheat.png);

  ${({ $overheat }) =>
    $overheat >= 1 &&
    `
    animation: blinker 1s linear infinite;

    @keyframes blinker {
      50% {
        opacity: 0.3;
      }
    }
  `}
`;

const Container = styled.div`
  cursor: pointer;
  position: relative;
  margin: 3px 0px;
  padding: 0 1px;
`;

type SystemIconProps = {
  systemId: number;
  ship: Ship;
  scs: boolean;
  systemMenu?: SystemMenuUiState;
  onSystemClicked?: MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
  text?: string;
  target?: Ship;
  inactive?: boolean;
  right: boolean;
};

const SystemIcon: React.FC<SystemIconProps> = ({
  systemId,
  ship,
  scs,
  onSystemClicked,
  selected = false,
  text = null,
  target = null,
  inactive = false,
  right,
  ...rest
}) => {
  const { activeSystemId, activeSystemElement, systemInfoMenuProvider } =
    useSystemMenu();

  const system = useSystem(ship.id, systemId);

  const uiState = useUiStateHandler();
  const ref = useRef<HTMLElement>(null);
  const [mouseOveredSystem, setMouseOveredSystem] =
    useState<HTMLElement | null>(null);

  const clickSystem: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    uiState.customEvent("systemClicked", {
      ship,
      system,
      element: ref.current,
      scs,
    });
  };

  const onSystemMouseOver: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const gameData = uiState.getGameData();
    const weaponFireService = new WeaponFireService();
    weaponFireService.update(gameData);

    const targetActual = (() => {
      if (target) {
        return target;
      }

      const targetId = weaponFireService.getSystemFireOrderTargetId(system);
      if (targetId) {
        return gameData.ships.getShipById(targetId);
      }

      return null;
    })();

    uiState.customEvent("systemMouseOver", {
      ship,
      system,
      element: ref.current,
      target: targetActual,
    });

    setMouseOveredSystem(ref.current);
  };

  const onSystemMouseOut: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    uiState.customEvent("systemMouseOut");

    setMouseOveredSystem(null);
  };

  const onContextMenu: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    uiState.customEvent("systemRightClicked", { system, ship });
  };

  if (!text) {
    text = system.getIconText();
  }

  const menu = activeSystemId ? systemInfoMenuProvider : null;

  const clicked =
    activeSystemId === system.id && activeSystemElement === ref.current;

  const displayMenu = Boolean(
    (!activeSystemId && mouseOveredSystem) || clicked
  );

  const weaponFireService = useMemo(() => {
    const gameData = uiState.getGameData();
    const weaponFireService = new WeaponFireService();
    weaponFireService.update(gameData);
    return weaponFireService;
  }, [uiState]);

  const firing = weaponFireService.systemHasFireOrder(system);
  const reserved = Boolean(
    target &&
      weaponFireService.systemHasFireOrder(system) &&
      !weaponFireService.systemHasFireOrderAgainstShip(system, target)
  );
  const targeting = Boolean(
    target && weaponFireService.systemHasFireOrderAgainstShip(system, target)
  );

  const disabled = system.isDisabled();
  const oldOverheat = system.heat.getOverheatPercentage();
  const { overheatPercentage: newOverheat } = system.heat.predictHeatChange();

  const overheat = newOverheat > oldOverheat ? newOverheat : oldOverheat;

  return (
    <>
      {displayMenu && scs && (
        <SystemInfo
          scs
          uiState={uiState}
          ship={ship}
          system={system}
          systemInfoMenuProvider={menu || undefined}
          element={mouseOveredSystem || activeSystemElement || undefined}
          target={target || undefined}
          right={right}
          {...rest}
        />
      )}
      <Container
        onClick={onSystemClicked || clickSystem}
        onMouseOver={onSystemMouseOver}
        onMouseOut={onSystemMouseOut}
        onContextMenu={onContextMenu}
      >
        {displayMenu && !scs && (
          <SystemInfo
            scs
            uiState={uiState}
            ship={ship}
            system={system}
            systemInfoMenuProvider={menu || undefined}
            element={mouseOveredSystem || activeSystemElement || undefined}
            target={target || undefined}
            right={right}
            {...rest}
          />
        )}
        <System
          ref={ref as LegacyRef<HTMLDivElement>}
          $background={system.getBackgroundImage()}
          $offline={isOffline(system) || undefined}
          $loading={isLoading() || undefined}
          $selected={selected || clicked || undefined}
          $firing={firing || undefined}
          $targeting={targeting || undefined}
          $reserved={reserved || undefined}
          $destroyed={system.isDestroyed() || undefined}
          $boosted={
            system.callHandler(SYSTEM_HANDLERS.getBoost, 0, false as boolean) ||
            undefined
          }
          $inactive={inactive || undefined}
        >
          {overheat > 0.25 && Boolean(!disabled) && (
            <Overheat $overheat={overheat} />
          )}
        </System>

        <SystemText $destroyed={system.isDestroyed() || undefined}>
          {text}
        </SystemText>
        <HealthBar
          $destroyed={system.isDestroyed() || undefined}
          $criticals={system.hasAnyCritical() || undefined}
          $health={getStructureLeft(system)}
        />
      </Container>
    </>
  );
};

const isLoading = () => false; //ASK FROM SYSTEM system.weapon && !weaponManager.isLoaded(system);

const isOffline = (system: ShipSystem) => system.power.isOffline();

const getStructureLeft = (system: ShipSystem) =>
  ((system.hitpoints - system.getTotalDamage()) / system.hitpoints) * 100;

export default SystemIcon;
