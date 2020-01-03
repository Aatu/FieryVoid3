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

const SystemTooltip = styled(Tooltip)`
  top: 0px;
  right: 335px;
  width: 200px;
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

  getContainer(children) {
    const { element, scs } = this.props;
    if (scs) {
      return <SystemTooltip>{children}</SystemTooltip>;
    }
    return <RelativeTooltip element={element}>{children}</RelativeTooltip>;
  }

  getWarnings() {
    const { system } = this.props;
    const warnings = [];
    if (system.isDestroyed()) {
      warnings.push("Destroyed");
    }
    if (system.power.isOffline()) {
      warnings.push("Offline");
    }
    return warnings;
  }
  render() {
    const {
      ship,
      system,
      systemInfoMenuProvider,
      uiState,
      weaponTargeting
    } = this.props;

    const Menu = systemInfoMenuProvider ? systemInfoMenuProvider() : null;

    const warnings = this.getWarnings();

    return this.getContainer(
      <>
        <TooltipHeader>{system.getDisplayName()}</TooltipHeader>
        {warnings.length > 0 && <div>LOL HI</div>}
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
      </>
    );
  }
}

const getEntry = ({ header, value }) => {
  if (value.replace) {
    value = value.replace(/<br>/gm, "\n");
  }

  return (
    <TooltipEntry key={header || value}>
      {header && <TooltipValueHeader>{header}: </TooltipValueHeader>}
      {value && <TooltipValue>{value}</TooltipValue>}
    </TooltipEntry>
  );
};

export default SystemInfo;
