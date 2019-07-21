import * as React from "react";
import styled from "styled-components";
import GamePositionComponent from "../GamePositionComponent";
import ShipWindow from "../shipWindow/ShipWindow";
import {
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  colors
} from "../../../../styled";

const InfoHeader = styled(TooltipHeader)`
  font-size: 12px;
`;

const ShipTooltipContainer = styled(Tooltip)`
  width: 300px;
  text-align: left;
  opacity: 0.95;
  position: relative;
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

const InfoValue = styled.span`
  color: ${colors.lightBlue};
`;

class ShipTooltip extends React.Component {
  render() {
    const {
      ship,
      getPosition,
      uiState,
      ui,
      shipTooltipMenuProvider,
      ...rest
    } = this.props;

    const Menu =
      ui && shipTooltipMenuProvider ? shipTooltipMenuProvider() : null;

    return (
      <GamePositionComponent
        getPosition={getPosition}
        uiState={uiState}
        marginTop={20}
        marginLeft={-150}
      >
        <ShipTooltipContainer>
          <InfoHeader>{ship.name}</InfoHeader>
          {Menu && <Menu uiState={uiState} ship={ship} {...rest} />}
          <ShipWindow ship={ship} uiState={uiState} {...rest} />
        </ShipTooltipContainer>
      </GamePositionComponent>
    );
  }
}

/*
const getCalledShot = (ship, selectedShip, system) => {
  if (weaponManager.canCalledshot(ship, system, selectedShip)) {
    return [<InfoHeader key="calledHeader">Called shot</InfoHeader>].concat(
      gamedata.selectedSystems.map((weapon, i) => {
        if (weaponManager.isOnWeaponArc(selectedShip, ship, weapon)) {
          if (weaponManager.checkIsInRange(selectedShip, ship, weapon)) {
            var value = weapon.firingMode;
            value = weapon.firingModes[value];
            if (system.id != null && !weaponManager.canWeaponCall(weapon)) {
              return (
                <Entry key={`called-${i}`}>
                  <Header>{weapon.displayName}</Header>CANNOT CALL SHOT
                </Entry>
              );
            } else {
              return (
                <Entry key={`called-${i}`}>
                  <Header>{weapon.displayName}</Header> - Approx:{" "}
                  {weaponManager.calculateHitChange(
                    selectedShip,
                    ship,
                    weapon,
                    system.id
                  )}
                  %
                </Entry>
              );
            }
          } else {
            return (
              <Entry key={`called-${i}`}>
                <Header>{weapon.displayName}</Header>NOT IN RANGE
              </Entry>
            );
          }
        } else {
          return (
            <Entry key={`called-${i}`}>
              <Header>{weapon.displayName}</Header>NOT IN ARC
            </Entry>
          );
        }
      })
    );
  } else {
    return [<InfoHeader key="calledHeader">Called shot</InfoHeader>].concat(
      <Entry>CANNOT TARGET</Entry>
    );
  }
};

*/

const getEntry = ({ header, value }) => {
  if (value.replace) {
    value = value.replace(/<br>/gm, "\n");
  }

  return (
    <Entry key={header}>
      <Header>{header}: </Header>
      <InfoValue>{value}</InfoValue>
    </Entry>
  );
};

export default ShipTooltip;
