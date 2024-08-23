import * as React from "react";
import styled from "styled-components";
import WeaponTargeting from "./WeaponTargeting";
import { TooltipHeader, TooltipValue } from "../../../../styled";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import WeaponFireService from "@fieryvoid3/model/src/weapon/WeaponFireService";
import UIState from "../UIState";
import { SYSTEM_HANDLERS } from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";
import WeaponHitChance from "@fieryvoid3/model/src/weapon/WeaponHitChance";
import TorpedoAttackService from "@fieryvoid3/model/src/weapon/TorpedoAttackService";
import Torpedo from "@fieryvoid3/model/src/unit/system/weapon/ammunition/torpedo/Torpedo";
import TorpedoLauncherStrategy from "@fieryvoid3/model/src/unit/system/strategy/weapon/TorpedoLauncherStrategy";
import TorpedoAttackEntry from "./TorpedoAttackEntry";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 8px;
`;

type SystemIconsProps = {
  systems: (TorpedoLauncherStrategy | ShipSystem)[];
  weaponFireService: WeaponFireService;
  uiState: UIState;
  shooter: Ship;
  ship: Ship;
};

const SystemIcons: React.FC<SystemIconsProps> = ({
  systems,
  weaponFireService,
  uiState,
  shooter,
  ship,
  ...rest
}) => {
  const targetShip = (system: ShipSystem) => {
    const hitChance = system.callHandler(
      SYSTEM_HANDLERS.getHitChance,
      {
        shooter: shooter,
        target: ship,
      },
      null as unknown as WeaponHitChance
    );

    if (hitChance.result <= 0) {
      return;
    }

    return () => {
      weaponFireService.removeFireOrders(shooter, system);
      weaponFireService.addFireOrder(shooter, ship, system);

      uiState.shipSystemStateChanged(shooter, system);
      uiState.shipStateChanged(shooter);
    };
  };

  const unTargetShip = (system: ShipSystem) => {
    return () => {
      weaponFireService.removeFireOrders(shooter, system);
      uiState.shipSystemStateChanged(shooter, system);
      uiState.shipStateChanged(shooter);
    };
  };

  const getOnClick =
    (system: ShipSystem): React.MouseEventHandler<HTMLDivElement> =>
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (!weaponFireService.systemHasFireOrderAgainstShip(system, ship)) {
        targetShip(system);
      } else {
        unTargetShip(system);
      }
    };

  return systems.map((system, i) => {
    if (system instanceof TorpedoLauncherStrategy) {
      return (
        <TorpedoAttackEntry
          key={`weaponTargeting-torpedo-${i}`}
          target={ship}
          launcher={system}
          uiState={uiState}
          absoluteTooltip
        />
      );
    }
    return (
      <WeaponTargeting
        key={`weaponTargeting-${system.id}`}
        uiState={uiState}
        system={system}
        target={ship}
        ship={shooter}
        onSystemClicked={getOnClick(system)}
        {...rest}
      />
    );
  });
};

const getSystems = (
  shooter: Ship,
  target: Ship,
  torpedoAttackService: TorpedoAttackService,
  weaponFireService: WeaponFireService,
  showZeroHitChance: boolean
): (TorpedoLauncherStrategy | ShipSystem)[] => {
  const systems = [
    ...torpedoAttackService
      .getPossibleTorpedosFrom(shooter, target)
      .sort((a, b) => {
        const aTorpedo: Torpedo = a.loadedTorpedo!;
        const bTorpedo: Torpedo = b.loadedTorpedo!;

        if (aTorpedo.maxRange < bTorpedo.maxRange) {
          return 1;
        }

        if (aTorpedo.maxRange > bTorpedo.maxRange) {
          return -1;
        }

        if (
          aTorpedo.getDamageStrategy().constructor.name <
          bTorpedo.getDamageStrategy().constructor.name
        ) {
          return 1;
        }

        if (
          aTorpedo.getDamageStrategy().constructor.name >
          bTorpedo.getDamageStrategy().constructor.name
        ) {
          return -1;
        }

        if (aTorpedo.getDisplayName() < bTorpedo.getDisplayName()) {
          return 1;
        }

        if (aTorpedo.getDisplayName() > bTorpedo.getDisplayName()) {
          return -1;
        }

        return 0;
      }),
    ...shooter.systems
      .getSystems()
      .filter(
        (system) =>
          weaponFireService.canFire(shooter, target, system) &&
          (showZeroHitChance ||
            system.callHandler(
              SYSTEM_HANDLERS.getHitChance,
              {
                shooter,
                target,
              },
              null as unknown as WeaponHitChance
            ).result > 0)
      )
      .sort((a, b) => {
        const hitChanceA = a.callHandler(
          SYSTEM_HANDLERS.getHitChance,
          {
            shooter,
            target,
          },
          null as unknown as WeaponHitChance
        ).result;

        const hitChanceB = b.callHandler(
          SYSTEM_HANDLERS.getHitChance,
          {
            shooter,
            target,
          },
          null as unknown as WeaponHitChance
        ).result;

        console.log("sort", hitChanceA, hitChanceB);
        if (hitChanceA > hitChanceB) {
          return -1;
        }

        if (hitChanceA < hitChanceB) {
          return 1;
        }

        return 0;
      }),
  ];

  return systems;
};

type Props = {
  shooter?: Ship;
  ship: Ship;
  uiState: UIState;
  showZeroHitChance?: boolean;
};

const WeaponTargetingList: React.FC<Props> = ({
  ship,
  uiState,
  showZeroHitChance = true,
  ...rest
}) => {
  const { weaponFireService, torpedoAttackService } = uiState.getServices();

  let shooter: Ship | undefined = rest.shooter;

  if (!shooter) {
    shooter = uiState.getSelectedShip() ?? undefined;
  }

  if (!shooter || uiState.getGameData().ships.isSameTeam(ship, shooter)) {
    return null;
  }

  const systems = getSystems(
    shooter,
    ship,
    torpedoAttackService,
    weaponFireService,
    showZeroHitChance
  );

  if (systems.length === 0) {
    return null;
  }

  return (
    <>
      <TooltipHeader>
        {ship.name} <TooltipValue>available weapons</TooltipValue>
      </TooltipHeader>
      <Container>
        <SystemIcons
          systems={systems}
          weaponFireService={weaponFireService}
          uiState={uiState}
          shooter={shooter}
          ship={ship}
        />
      </Container>
    </>
  );
};

export default WeaponTargetingList;
