import React, { MouseEventHandler, useEffect } from "react";
import styled from "styled-components";
import SystemInfoWeaponTargeting from "./SystemInfoWeaponTargeting";
import {
  TooltipHeader,
  TooltipEntry,
  colors,
  TooltipValue,
  TooltipSubHeader,
  RelativeOrStaticTooltip,
  TooltipBuilder,
} from "../../../../styled";
import SystemStrategyUi from "./SystemStrategyUi";
import SystemStrategyUiComponent from "./SystemStrategyUi/SystemStrategyUiComponent";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import UIState, { TooltipComponentProvider } from "../UIState";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { useForceRerender } from "../../../../util/useForceRerender";
import { TooltipComponentRenderer } from "../../../../styled/Tooltip";
import WeaponHitChance from "@fieryvoid3/model/src/weapon/WeaponHitChance";
import { useUiStateHandler } from "../../../../state/useUIStateHandler";

type TooltipContainerProps = {
  onClick: MouseEventHandler<HTMLDivElement>;
};

const TooltipContainer = styled(RelativeOrStaticTooltip)<TooltipContainerProps>`
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

type HeaderMenuItemProps = {
  $active: boolean;
};

export const HeaderMenuItem = styled.div<HeaderMenuItemProps>`
  cursor: pointer;
  font-weight: bolder;
  margin-right: 4px;
  font-size: 12px;

  ${(props) => props.$active && `color: white;`}
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

const componentRenderer =
  (ship: Ship, system: ShipSystem): TooltipComponentRenderer =>
  (component, props, key) =>
    (
      <SystemStrategyUiComponentContainer key={key}>
        <SystemStrategyUiComponent
          name={component}
          system={system}
          ship={ship}
          componentProps={props}
        />
      </SystemStrategyUiComponentContainer>
    );

const InfoTab: React.FC<{ system: ShipSystem }> = ({ system }) => {
  return (
    <TooltipBuilder
      entries={[
        {
          value: system.getSystemDescription(),
        },
      ]}
    />
  );
};

const LogTab: React.FC<{ system: ShipSystem }> = ({ system }) => {
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
};

const getWarnings = (system: ShipSystem) => {
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
};

type DefaultTabProps = {
  ship: Ship;
  system: ShipSystem;
  systemInfoMenuProvider?: TooltipComponentProvider;
  weaponTargeting?: {
    target: Ship;
    hitChance: WeaponHitChance;
  };
};

const DefaultTab: React.FC<DefaultTabProps> = ({
  ship,
  system,
  systemInfoMenuProvider,
  weaponTargeting,
}) => {
  const uiState = useUiStateHandler();
  const Menu = systemInfoMenuProvider ? systemInfoMenuProvider() : undefined;

  const warnings = getWarnings(system);

  return (
    <>
      {Menu && <Menu uiState={uiState} ship={ship} system={system} />}

      {warnings && (
        <TooltipEntry>
          <Warning>{warnings}</Warning>
        </TooltipEntry>
      )}
      <TooltipBuilder
        entries={system.getSystemInfo()}
        componentRenderer={componentRenderer(ship, system)}
      />
      <SystemStrategyUi ship={ship} system={system} />
      {weaponTargeting && (
        <SystemInfoWeaponTargeting
          target={weaponTargeting.target}
          hitChance={weaponTargeting.hitChance}
        />
      )}
    </>
  );
};

type SystemInfoProps = {
  system: ShipSystem;
  element?: HTMLElement;
  scs: boolean;
  right?: boolean;
  uiState: UIState;
  ship: Ship;
  systemInfoMenuProvider?: TooltipComponentProvider;
  target?: Ship;
};

const SystemInfo: React.FC<SystemInfoProps> = ({
  system,
  element,
  scs,
  right = false,
  uiState,
  ship,
  systemInfoMenuProvider,
}) => {
  const [tab, setTab] = React.useState<string | null>(null);
  const rerender = useForceRerender();

  useEffect(() => {
    const onSystemChanged = (newShip: Ship, newSystem: ShipSystem) => {
      if (ship.id === newShip.id && system.id === newSystem.id) {
        rerender();
      }
    };

    uiState.subscribeToSystemChange(onSystemChanged);

    return () => {
      uiState.unsubscribeFromSystemChange(onSystemChanged);
    };
  }, [system, element, scs, right, uiState, ship.id, rerender]);

  return (
    <TooltipContainer
      relative={!scs}
      element={element}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <TooltipHeader>
        {system.getDisplayName()}
        <HeaderMenu>
          <HeaderMenuItem
            $active={tab === "log"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTab("log");
            }}
          >
            L
          </HeaderMenuItem>
          <HeaderMenuItem
            $active={tab === "info"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTab("info");
            }}
          >
            ?
          </HeaderMenuItem>

          <HeaderMenuItem
            $active={!tab}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTab(null);
            }}
          >
            D
          </HeaderMenuItem>
        </HeaderMenu>
      </TooltipHeader>

      {!tab && (
        <DefaultTab
          ship={ship}
          system={system}
          systemInfoMenuProvider={systemInfoMenuProvider}
        />
      )}
      {tab === "log" && <LogTab system={system} />}
      {tab === "info" && <InfoTab system={system} />}
    </TooltipContainer>
  );
};

export default SystemInfo;
