import * as React from "react";
import styled from "styled-components";
import SystemIcon from "../system/SystemIcon";
import { colors } from "../../../../styled";
import StructureIcon from "../system/StructureIcon";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import SystemSection from "@fieryvoid3/model/src/unit/system/systemSection/SystemSection";
import UIState from "../UIState";

type ShipSectionContainerProps = {
  $location: number;
};

const ShipSectionContainer = styled.div<ShipSectionContainerProps>`
  display: flex;
  flex-wrap: wrap-reverse;
  width: calc(100% - 2px);
  align-items: end;
  justify-content: space-around;
  box-sizing: border-box;
  margin: 1px;
  flex-grow: 1;

  border: ${(props) => {
    switch (props.$location) {
      case 0:
        return `1px solid ${colors.systemWindowPrimaryBorder}`;
      default:
        return `1px dashed ${colors.systemWindowBorder}`;
    }
  }};
`;

type Props = {
  ship: Ship;
  section?: SystemSection;
  uiState: UIState;
  right: boolean;
};

const ShipSection: React.FC<Props> = ({ ship, section, uiState, right }) => {
  if (!section) {
    return null;
  }

  const location = section.getLocation();
  const structure = section.getStructure();

  return (
    <ShipSectionContainer $location={location}>
      {section.getNonStructureSystems().map((system) => (
        <SystemIcon
          scs
          key={`system-scs-${location}-${ship.id}-${system.id}`}
          systemId={system.id}
          ship={ship}
          selected={uiState.isSelectedSystem(system)}
          right={right}
        />
      ))}

      {structure && (
        <StructureIcon
          system={structure}
          ship={ship}
          selected={uiState.isSelectedSystem(structure)}
          right={right}
        />
      )}
    </ShipSectionContainer>
  );
};

export default ShipSection;
