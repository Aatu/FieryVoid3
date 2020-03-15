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
  filter: brightness(1);
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

class SystemInfoWeaponTargeting extends React.Component {
  render() {
    const { ship, system, uiState, target, hitChance } = this.props;

    return (
      <>
        <InfoHeader>TARGET: {target.name}</InfoHeader>
        <Entry>
          <Header>Base hit change: </Header>
          <InfoValue>{hitChance.baseToHit}%</InfoValue>
        </Entry>
        <Entry>
          <Header>Fire control: </Header>
          <InfoValue>+{hitChance.fireControl} to hit</InfoValue>
        </Entry>
        <Entry>
          <Header>Distance: </Header>
          <InfoValue>
            {hitChance.distance} hexes,{" "}
            {hitChance.outOfRange
              ? `out of range`
              : `${hitChance.rangeModifier} to hit`}
          </InfoValue>
        </Entry>
        <Entry>
          <Header>Evasion: </Header>
          <InfoValue>{`+${hitChance.evasion * 10}% range penalty`}</InfoValue>
        </Entry>
        <Entry>
          <Header>OEW: </Header>
          <InfoValue>+{hitChance.oew * 5} to hit</InfoValue>
        </Entry>
        <Entry>
          <Header>DEW: </Header>
          <InfoValue>-{hitChance.dew * 5} to hit</InfoValue>
        </Entry>
        <Entry>
          <Header>Your evasion: </Header>
          <InfoValue>{`${hitChance.ownEvasionPenalty} to hit`}</InfoValue>
        </Entry>
        {hitChance.noLockPenalty !== 0 && (
          <Entry>
            <Header>No lock on target: </Header>
            <InfoValue>{`${hitChance.noLockPenalty} to hit`}</InfoValue>
          </Entry>
        )}

        <Entry>
          <Header>FINAL HIT CHANGE: </Header>
          <InfoValue>{hitChance.result}%</InfoValue>
        </Entry>
      </>
    );
  }
}

export default SystemInfoWeaponTargeting;
