import * as React from "react";
import styled from "styled-components";
import SystemInfoWeaponTargeting from "./SystemInfoWeaponTargeting";
import {
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  colors,
  RelativeTooltip
} from "../../../../styled";
import SystemStrategyUi from "./SystemStrategyUi";

export const InfoHeader = styled(TooltipHeader)`
  font-size: 12px;
`;

const SystemInfoTooltip = styled(RelativeTooltip)`
  width: ${props => (props.ship ? "300px" : "200px")};
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

class SystemInfo extends React.Component {
  render() {
    const {
      ship,
      system,
      element,
      systemInfoMenuProvider,
      uiState,
      weaponTargeting
    } = this.props;

    const Menu = systemInfoMenuProvider ? systemInfoMenuProvider() : null;

    return (
      <SystemInfoTooltip element={element}>
        <InfoHeader>{system.getDisplayName()}</InfoHeader>
        {Menu && <Menu uiState={uiState} ship={ship} system={system} />}
        {system.getSystemInfo(ship).map(getEntry)}
        <SystemStrategyUi system={system} uiState={uiState} />
        {weaponTargeting && (
          <SystemInfoWeaponTargeting
            uiState={uiState}
            ship={ship}
            system={system}
            target={weaponTargeting.target}
            hitChange={weaponTargeting.hitChange}
          />
        )}
      </SystemInfoTooltip>
    );
  }
}

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

export default SystemInfo;
