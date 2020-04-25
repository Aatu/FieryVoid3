import * as React from "react";
import styled from "styled-components";
import SystemInfoWeaponTargeting from "./SystemInfoWeaponTargeting";
import {
  TooltipHeader,
  TooltipEntry,
  colors,
  TooltipValue,
  buildTooltipEntries,
  TooltipSubHeader,
  RelativeOrStaticTooltip,
} from "../../../../styled";
import SystemStrategyUi from "./SystemStrategyUi";
import SystemStrategyUiComponent from "./SystemStrategyUi/SystemStrategyUiComponent";

const TooltipContainer = styled(RelativeOrStaticTooltip)`
  max-height: 85vh;
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
  line-height: 14px;
  display: flex;
  flex-direction: row;
  color: #5e85bc;
`;

export const HeaderMenuItem = styled.div`
  cursor: pointer;
  font-weight: bolder;
  margin-right: 4px;
  font-size: 12px;

  ${(props) => props.active && `color: white;`}
  &:last-child {
    margin: 0;
  }
  :hover {
    color: white;
  }
`;

const SystemStrategyUiComponentContainer = styled.div`
  margin: 0 8px;
  position: relative;
`;

const LogContainer = styled.div`
  overflow-y: scroll;
  scrollbar-width: 0;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

class SystemInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: null,
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
      .map((critical) => critical.getMessage());

    return [...warnings, ...criticals].join(", ");
  }

  getComponentHandler() {
    const { system, uiState, ship } = this.props;

    return (component, props, key) => (
      <SystemStrategyUiComponentContainer key={key}>
        <SystemStrategyUiComponent
          name={component}
          system={system}
          uiState={uiState}
          ship={ship}
          {...props}
        />
      </SystemStrategyUiComponentContainer>
    );
  }

  getInfoTab() {
    const { system } = this.props;

    return buildTooltipEntries([
      {
        value: system.getSystemDescription(),
      },
    ]);
  }

  getLogTab() {
    const { system } = this.props;

    const messages = system.log.getWithTurns();

    return messages.reverse().map(({ turn, messages }, index) => (
      <LogContainer key={`systemlog-turn-${turn}-${index}`}>
        <TooltipSubHeader>{`Log, turn ${turn}`}</TooltipSubHeader>
        {messages.map((message, messageIndex) => (
          <TooltipEntry key={`logmessage-${turn}-${index}-${messageIndex}`}>
            <TooltipValue>{message}</TooltipValue>
          </TooltipEntry>
        ))}
      </LogContainer>
    ));
  }

  getDefaultTab() {
    const {
      ship,
      system,
      systemInfoMenuProvider,
      uiState,
      weaponTargeting,
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

        {buildTooltipEntries(
          system.getSystemInfo(ship),
          this.getComponentHandler()
        )}
        <SystemStrategyUi ship={ship} system={system} uiState={uiState} />
        {weaponTargeting && (
          <SystemInfoWeaponTargeting
            uiState={uiState}
            ship={ship}
            system={system}
            target={weaponTargeting.target}
            hitChance={weaponTargeting.hitChance}
          />
        )}
      </>
    );
  }
  render() {
    const { system, element, scs, right } = this.props;

    const { tab } = this.state;

    return (
      <TooltipContainer
        relative={!scs}
        element={element}
        right={right}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <TooltipHeader>
          {system.getDisplayName()}
          <HeaderMenu>
            <HeaderMenuItem
              active={tab === "log"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.setState({ tab: "log" });
              }}
            >
              L
            </HeaderMenuItem>
            <HeaderMenuItem
              active={tab === "info"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.setState({ tab: "info" });
              }}
            >
              ?
            </HeaderMenuItem>

            <HeaderMenuItem
              active={!tab}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.setState({ tab: null });
              }}
            >
              D
            </HeaderMenuItem>
          </HeaderMenu>
        </TooltipHeader>

        {!tab && this.getDefaultTab()}
        {tab === "log" && this.getLogTab()}
        {tab === "info" && this.getInfoTab()}
      </TooltipContainer>
    );
  }
}

export default SystemInfo;
