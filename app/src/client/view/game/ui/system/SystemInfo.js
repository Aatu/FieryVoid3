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
  TooltipValueHeader,
  InlineTooltipEntry,
  buildTooltipEntries
} from "../../../../styled";
import SystemStrategyUi from "./SystemStrategyUi";

const SystemTooltip = styled(Tooltip)`
  top: 0px;
  right: 335px;
  width: 200px;
`;

const Warning = styled.div`
  color: ${colors.textDanger};
  font-weight: bold;

  animation: blinker 2s linear infinite;

  @keyframes blinker {
    50% {
      opacity: 0.5;
    }
  }
`;

const HeaderMenu = styled.div`
  display: flex;
  flex-direction: row;
  color: #5e85bc;
`;

const HeaderMenuItem = styled.div`
  cursor: pointer;
  font-weight: bolder;
  margin-right: 4px;

  &:last-child {
    margin: 0;
  }
  :hover {
    color: white;
  }
`;

class SystemInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: null
    };
  }

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
      warnings.push("DESTROYED");
    }
    if (system.power.isOffline()) {
      warnings.push("OFFLINE");
    }

    const criticals = system.damage
      .getCriticals()
      .map(critical => critical.getMessage());

    return [...warnings, ...criticals].join(", ");
  }

  getInfoTab() {
    const { system } = this.props;
    console.log("DESC", system.getSystemDescription());
    return buildTooltipEntries([
      {
        value: system.getSystemDescription()
      }
    ]);
  }

  getLogTab() {
    return null;
  }

  getDefaultTab() {
    const {
      ship,
      system,
      systemInfoMenuProvider,
      uiState,
      weaponTargeting
    } = this.props;

    const Menu = systemInfoMenuProvider ? systemInfoMenuProvider() : null;

    const warnings = this.getWarnings();

    return (
      <>
        {Menu && <Menu uiState={uiState} ship={ship} system={system} />}

        {warnings && (
          <TooltipEntry>
            <Warning>{warnings}</Warning>
          </TooltipEntry>
        )}

        {buildTooltipEntries(system.getSystemInfo(ship))}
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
  render() {
    const { system } = this.props;

    const { tab } = this.state;

    return this.getContainer(
      <>
        <TooltipHeader>
          {system.getDisplayName()}
          <HeaderMenu>
            {tab !== "log" && (
              <HeaderMenuItem
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.setState({ tab: "log" });
                }}
              >
                L
              </HeaderMenuItem>
            )}
            {tab !== "info" && (
              <HeaderMenuItem
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.setState({ tab: "info" });
                }}
              >
                ?
              </HeaderMenuItem>
            )}

            {tab && (
              <HeaderMenuItem
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.setState({ tab: null });
                }}
              >
                X
              </HeaderMenuItem>
            )}
          </HeaderMenu>
        </TooltipHeader>

        {!tab && this.getDefaultTab()}
        {tab === "log" && this.getLogTab()}
        {tab === "info" && this.getInfoTab()}
      </>
    );
  }
}

export default SystemInfo;
