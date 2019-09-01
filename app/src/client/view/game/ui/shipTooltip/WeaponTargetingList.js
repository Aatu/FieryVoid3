import * as React from "react";
import styled from "styled-components";
import WeaponTargeting from "./WeaponTargeting";
import {
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  colors
} from "../../../../styled";

const InfoHeader = styled(TooltipHeader)`
  border: none;
  margin-bottom: 0;
  font-size: 12px;
`;

const Container = styled.div`
  display: flex;
`;

class WeaponTargetingList extends React.Component {
  getSystemIcons(
    systems,
    weaponFireService,
    uiState,
    selectedShip,
    ship,
    rest
  ) {
    return {
      unassigned: systems
        .filter(
          system =>
            !weaponFireService.systemHasFireOrderAgainstShip(system, ship)
        )
        .map(system => (
          <WeaponTargeting
            key={`weaponTargeting-${system.id}`}
            uiState={uiState}
            system={system}
            target={ship}
            ship={selectedShip}
            onSystemClicked={this.targetShip(
              system,
              selectedShip,
              ship,
              uiState
            )}
            {...rest}
          />
        )),
      assigned: systems
        .filter(system =>
          weaponFireService.systemHasFireOrderAgainstShip(system, ship)
        )
        .map(system => (
          <WeaponTargeting
            key={`weaponTargeting-${system.id}`}
            uiState={uiState}
            system={system}
            target={ship}
            ship={selectedShip}
            onSystemClicked={this.unTargetShip(
              system,
              selectedShip,
              ship,
              uiState
            )}
            {...rest}
          />
        ))
    };
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
    const { weaponFireService } = uiState.services;

    const { selectedShip } = uiState.state;

    if (uiState.gameData.ships.isSameTeam(ship, selectedShip)) {
      return null;
    }

    const systems = selectedShip.systems
      .getSystems()
      .filter(system => weaponFireService.canFire(selectedShip, ship, system));

    const icons = this.getSystemIcons(
      systems,
      weaponFireService,
      uiState,
      selectedShip,
      ship,
      rest
    );

    return (
      <>
        <Container>{icons.unassigned}</Container>
        <InfoHeader>Assigned weapons</InfoHeader>
        <Container>{icons.assigned}</Container>
      </>
    );
  }
}

export default WeaponTargetingList;
