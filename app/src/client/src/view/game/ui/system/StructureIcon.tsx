import React, { LegacyRef, useRef, useState } from "react";
import styled from "styled-components";
import SystemInfo from "./SystemInfo";

import UIState, { SystemMenuUiState } from "../UIState";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";

const StructureText = styled.div`
  z-index: 1;
`;

type StructureContainerProps = {
  health: number;
  criticals: boolean;
};

const StructureContainer = styled.div<StructureContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: calc(100% - 4px);
  height: 16px;
  background-color: #081313;
  color: ${(props) => (props.health === 0 ? "transparent" : "white")};
  font-family: arial;
  font-size: 11px;
  text-shadow: black 0 0 6px, black 0 0 6px;
  margin: 1px;
  filter: ${(props) => (props.health === 0 ? "blur(1px)" : "none")};
  border: 1px solid black;

  :before {
    box-sizing: border-box;
    content: "";
    position: absolute;
    width: ${(props) => `${props.health}%`};
    height: 100%;
    left: 0;
    bottom: 0;
    z-index: 0;
    background-color: ${(props) => (props.criticals ? "#ed6738" : "#427231")};
  }
`;

type StructureIconProps = {
  uiState: UIState;
  system: ShipSystem;
  ship: Ship;
  systemMenu?: SystemMenuUiState;
  onSystemClicked?: (event: React.MouseEvent<HTMLDivElement>) => void;
  selected: boolean;
  text?: string;
  target?: Ship;
};

const StructureIcon: React.FC<StructureIconProps> = ({
  uiState,
  system,
  ship,
  systemMenu: { systemInfoMenuProvider, activeSystem, activeSystemElement } = {
    systemInfoMenuProvider: null,
    activeSystem: null,
    activeSystemElement: null,
  },
  onSystemClicked,
  target = null,
  ...rest
}) => {
  const element = useRef<HTMLElement>(null);
  const [mouseOveredSystem, setMouseOveredSystem] =
    useState<HTMLElement | null>(null);

  const clickSystem: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    uiState.customEvent("systemClicked", {
      ship,
      system,
      element: element.current,
      scs: true,
    });
  };

  const onSystemMouseOver: React.MouseEventHandler<HTMLDivElement> = (
    event
  ) => {
    event.stopPropagation();
    event.preventDefault();

    uiState.customEvent("systemMouseOver", {
      ship,
      system,
      element: element.current,
    });

    setMouseOveredSystem(element.current);
  };

  const onSystemMouseOut: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    uiState.customEvent("systemMouseOut");

    setMouseOveredSystem(null);
  };

  const onContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();

    uiState.customEvent("systemRightClicked", { system, ship });
  };

  const menu = activeSystem ? systemInfoMenuProvider : null;

  const displayMenu = Boolean(
    (!activeSystem && mouseOveredSystem) ||
      (activeSystem &&
        activeSystem === system &&
        activeSystemElement === element.current)
  );

  return (
    <>
      {displayMenu && (
        <SystemInfo
          scs
          uiState={uiState}
          ship={ship}
          system={system}
          systemInfoMenuProvider={menu || undefined}
          element={mouseOveredSystem || activeSystemElement || undefined}
          target={target || undefined}
          {...rest}
        />
      )}
      <StructureContainer
        ref={element as LegacyRef<HTMLDivElement>}
        onClick={onSystemClicked || clickSystem}
        onMouseOver={onSystemMouseOver}
        onMouseOut={onSystemMouseOut}
        onContextMenu={onContextMenu}
        health={getStructureLeft(system)}
        criticals={system.hasAnyCritical()}
      >
        <StructureText>
          {system.getRemainingHitpoints()} / {system.hitpoints} A{" "}
          {system.getArmor()}
        </StructureText>
      </StructureContainer>
    </>
  );
};

const getStructureLeft = (system: ShipSystem) =>
  ((system.hitpoints - system.getTotalDamage()) / system.hitpoints) * 100;

export default StructureIcon;
