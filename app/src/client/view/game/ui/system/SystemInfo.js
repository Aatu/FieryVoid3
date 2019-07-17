import * as React from "react";
import styled from "styled-components";
import {
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  colors
} from "../../../../styled";

const InfoHeader = styled(TooltipHeader)`
  font-size: 12px;
`;

const SystemInfoTooltip = styled(Tooltip)`
    position: absolute;
    z-index: 20000;
    ${props =>
      Object.keys(props.position).reduce((style, key) => {
        return style + "\n" + key + ":" + props.position[key] + "px;";
      }, "")}
    width: ${props => (props.ship ? "300px" : "200px")};
    text-align: left;
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

class SystemInfo extends React.Component {
  render() {
    const { ship, system, element } = this.props;
    return (
      <SystemInfoTooltip position={getPosition(element)}>
        <InfoHeader>{system.getDisplayName()}</InfoHeader>
        {system.getSystemInfo(ship).map(getEntry)}
      </SystemInfoTooltip>
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

const getCriticals = system =>
  [<InfoHeader key="criticalHeader">Damage</InfoHeader>].concat(
    Object.keys(system.critData).map(i => {
      let noOfCrits = 0;
      for (const j in system.criticals) {
        if (system.criticals[j].phpclass == i) noOfCrits++;
      }
      if (noOfCrits > 1) {
        return (
          <Entry key={`critical-${i}`}>
            ({noOfCrits} x) {system.critData[i]}
          </Entry>
        );
      } else {
        return <Entry key={`critical-${i}`}>{system.critData[i]}</Entry>;
      }
    })
  );

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

const getPosition = element => {
  const boundingBox = element.getBoundingClientRect
    ? element.getBoundingClientRect()
    : element.get(0).getBoundingClientRect();

  const position = {};

  if (boundingBox.top > window.innerHeight / 2) {
    position.bottom = 31;
  } else {
    position.top = 31;
  }

  if (boundingBox.left > window.innerWidth / 2) {
    position.right = 0;
  } else {
    position.left = 0;
  }

  return position;
};

export default SystemInfo;
