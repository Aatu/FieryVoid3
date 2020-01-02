import * as React from "react";
import styled from "styled-components";
import SystemInfoWeaponTargeting from "./SystemInfoWeaponTargeting";
import {
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  colors,
  TooltipValue,
  RelativeTooltip,
  TooltipValueHeader
} from "../../../../styled";
import SystemStrategyUi from "./SystemStrategyUi";

const SystemInfoTooltip = styled(RelativeTooltip)`
  width: ${props => (props.ship ? "300px" : "200px")};
  filter: brightness(1);
  background-color: #181c2a;
`;

class SystemInfo extends React.Component {
  systemChangedCallback(ship, system) {
    if (ship.id === this.props.ship.id && system.id === this.props.system.id) {
      this.forceUpdate();
    }
  }

  componentDidMount() {
    const { uiState } = this.props;
    this.systemChangedCallbackInstance = this.systemChangedCallback.bind(this);
    uiState.subscribeToSystemChange(this.systemChangedCallbackInstance);
  }

  componentWillUnmount() {
    const { uiState } = this.props;
    uiState.unsubscribeFromSystemChange(this.systemChangedCallbackInstance);
  }

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
        <TooltipHeader>{system.getDisplayName()}</TooltipHeader>
        {Menu && <Menu uiState={uiState} ship={ship} system={system} />}
        {system.getSystemInfo(ship).map(getEntry)}
        <SystemStrategyUi ship={ship} system={system} uiState={uiState} />
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
    <TooltipEntry key={header}>
      <TooltipValueHeader>{header}: </TooltipValueHeader>
      <TooltipValue>{value}</TooltipValue>
    </TooltipEntry>
  );
};

export default SystemInfo;
