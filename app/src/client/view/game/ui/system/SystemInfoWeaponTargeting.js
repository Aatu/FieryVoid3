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
    const { ship, system, uiState, target, hitChange } = this.props;

    return (
      <>
        <InfoHeader>TARGET: {target.name}</InfoHeader>
        <Entry>
          <Header>Base hit change: </Header>
          <InfoValue>{hitChange.baseToHit}%</InfoValue>
        </Entry>
        <Entry>
          <Header>Fire control: </Header>
          <InfoValue>+{hitChange.fireControl} to hit</InfoValue>
        </Entry>
        <Entry>
          <Header>Distance: </Header>
          <InfoValue>
            {hitChange.distance} hexas, {hitChange.rangeModifier} to hit
          </InfoValue>
        </Entry>
        <Entry>
          <Header>OEW x 5: </Header>
          <InfoValue>+{hitChange.oew * 5} to hit</InfoValue>
        </Entry>
        <Entry>
          <Header>DEW x 5: </Header>
          <InfoValue>-{hitChange.dew * 5} to hit</InfoValue>
        </Entry>
        <Entry>
          <Header>FINAL HIT CHANGE: </Header>
          <InfoValue>{hitChange.result}%</InfoValue>
        </Entry>
      </>
    );
  }
}

export default SystemInfoWeaponTargeting;
