import * as React from "react";
import styled from "styled-components";
import GamePositionComponent from "../GamePositionComponent";
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
  margin-left: -50%;
  text-align: left;
  opacity: 0.8;
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

const TestDiv = styled.div`
  width: 40px;
  height: 40px;
  background-color: red;
  margin-left: -50%;
`;

class ShipTooltip extends React.Component {
  render() {
    const { ship, getPosition, uiState } = this.props;
    return (
      <GamePositionComponent
        getPosition={getPosition}
        uiState={uiState}
        marginTop={20}
      >
        <ShipTooltipContainer>
          <InfoHeader>{ship.name}</InfoHeader>
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
