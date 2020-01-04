import * as React from "react";
import styled from "styled-components";
import SystemIcon from "../system/SystemIcon";
import { colors } from "../../../../styled";
import * as systemLocation from "../../../../../model/unit/system/systemSection/systemLocation";
import StructureIcon from "../system/StructureIcon";

const ShipSectionContainer = styled.div`
  display: flex;
  flex-wrap: wrap-reverse;
  width: calc(100% - 2px);
  align-items: end;
  justify-content: space-around;
  align-content: center;
  box-sizing: border-box;
  margin: 1px;
  flex-grow: 1;

  border: ${props => {
    switch (props.location) {
      case 0:
        return `1px solid ${colors.systemWindowPrimaryBorder}`;
      default:
        return `1px dashed ${colors.systemWindowBorder}`;
    }
  }};
`;

const StructureText = styled.div`
  z-index: 1;
`;

const StructureContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: calc(100% - 4px);
  height: 16px;
  background-color: #081313;
  color: ${props => (props.health === 0 ? "transparent" : "white")};
  font-family: arial;
  font-size: 11px;
  text-shadow: black 0 0 6px, black 0 0 6px;
  margin: 1px;
  filter: ${props => (props.health === 0 ? "blur(1px)" : "none")};
  border: 1px solid black;

  :before {
    box-sizing: border-box;
    content: "";
    position: absolute;
    width: ${props => `${props.health}%`};
    height: 100%;
    left: 0;
    bottom: 0;
    z-index: 0;
    background-color: ${props => (props.criticals ? "#ed6738" : "#427231")};
  }
`;

class ShipSection extends React.Component {
  render() {
    const { ship, section, uiState, ...rest } = this.props;
    const location = section.location;
    const structure = section.getStructure();

    return (
      <ShipSectionContainer location={location}>
        {section.getNonStructureSystems().map(system => (
          <SystemIcon
            scs
            uiState={uiState}
            key={`system-scs-${location}-${ship.id}-${system.id}`}
            system={system}
            ship={ship}
            selected={uiState.isSelectedSystem(system)}
            {...rest}
          />
        ))}

        {structure && (
          <StructureIcon
            uiState={uiState}
            system={structure}
            ship={ship}
            selected={uiState.isSelectedSystem(structure)}
            {...rest}
          />
        )}
      </ShipSectionContainer>
    );
  }
}

export default ShipSection;
