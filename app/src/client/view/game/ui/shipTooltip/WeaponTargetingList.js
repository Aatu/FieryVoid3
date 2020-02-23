import * as React from "react";
import styled from "styled-components";
import WeaponTargeting from "./WeaponTargeting";
import {
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  colors,
  TooltipValue
} from "../../../../styled";
import TorpedoLauncherStrategy from "../../../../../model/unit/system/strategy/weapon/TorpedoLauncherStrategy.mjs";
import TorpedoAttackService from "../../../../../model/weapon/TorpedoAttackService.mjs";
import TorpedoAttackEntry from "./TorpedoAttackEntry";

const InfoHeader = styled(TooltipHeader)`
  border: none;
  margin-bottom: 0;
  font-size: 12px;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 8px;
`;

class WeaponTargetingList extends React.Component {
  constructor(props) {
    super(props);

    this.torpedoAttackService = new TorpedoAttackService();
  }

  getSystemIcons(systems, weaponFireService, uiState, shooter, ship, rest) {
    return systems.map((system, i) => {
      if (system instanceof TorpedoLauncherStrategy) {
        return (
          <TorpedoAttackEntry
            key={`weaponTargeting-torpedo-${i}`}
            target={ship}
            launcher={system}
            uiState={uiState}
            absoluteTooltip="right"
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
          onSystemClicked={
            !weaponFireService.systemHasFireOrderAgainstShip(system, ship)
              ? this.targetShip(system, shooter, ship, uiState)
              : this.unTargetShip(system, shooter, ship, uiState)
          }
          {...rest}
        />
      );
    });
  }

  targetShip(system, ship, target, uiState) {
    const { weaponFireService } = uiState.services;

    return () => {
      weaponFireService.removeFireOrders(ship, system);
      weaponFireService.addFireOrder(ship, target, system);

      uiState.shipSystemStateChanged(ship, system);
      uiState.shipStateChanged(ship);
    };
  }

  unTargetShip(system, ship, target, uiState) {
    const { weaponFireService } = uiState.services;

    return () => {
      weaponFireService.removeFireOrders(ship, system);
      uiState.shipSystemStateChanged(ship, system);
      uiState.shipStateChanged(ship);
    };
  }

  render() {
    const { ship, uiState, ...rest } = this.props;
    let { shooter } = this.props;
    const { weaponFireService } = uiState.services;

    if (!shooter) {
      shooter = uiState.getSelectedShip();
    }

    if (!shooter || uiState.gameData.ships.isSameTeam(ship, shooter)) {
      return null;
    }

    const systems = [
      ...shooter.systems.getSystems().filter(
        system =>
          weaponFireService.canFire(shooter, ship, system) &&
          system.callHandler("getHitChange", {
            shooter,
            target: ship
          }).result > 0
      ),
      ...this.torpedoAttackService.getPossibleTorpedosFrom(shooter, ship)
    ];

    if (systems.length === 0) {
      return null;
    }

    const icons = this.getSystemIcons(
      systems,
      weaponFireService,
      uiState,
      shooter,
      ship,
      rest
    );

    return (
      <>
        <TooltipHeader>
          {ship.name} <TooltipValue>available weapons</TooltipValue>
        </TooltipHeader>
        <Container>{icons}</Container>
      </>
    );
  }
}

export default WeaponTargetingList;
