import * as React from "react";
import styled from "styled-components";
import SystemIcon from "../system/SystemIcon";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import UIState from "../UIState";
import { SYSTEM_HANDLERS } from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";
import WeaponHitChance from "@fieryvoid3/model/src/weapon/WeaponHitChance";

const Container = styled.div`
  display: flex;
`;

type Props = {
  uiState: UIState;
  ship: Ship;
  system: ShipSystem;
  target: Ship;
  onSystemClicked: React.MouseEventHandler<HTMLDivElement>;
};

const WeaponTargeting: React.FC<Props> = ({
  uiState,
  ship,
  target,
  system,
  ...rest
}) => {
  const { weaponFireService } = uiState.getServices();

  if (!weaponFireService.canFire(ship, target, system)) {
    return null;
  }

  const hitChance = system.callHandler(
    SYSTEM_HANDLERS.getHitChance,
    {
      shooter: ship,
      target,
    },
    null as unknown as WeaponHitChance
  );

  return (
    <Container>
      <SystemIcon
        scs
        key={`system-weaponTargeting-${ship.id}-${system.id}`}
        systemId={system.id}
        ship={ship}
        selected={false}
        target={target}
        text={hitChance.result + "%"}
        inactive={hitChance.result <= 0 || undefined}
        {...rest}
      />
    </Container>
  );
};

export default WeaponTargeting;
