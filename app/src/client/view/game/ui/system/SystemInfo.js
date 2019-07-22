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

class SystemInfo extends React.Component {
  render() {
    const {
      ship,
      system,
      element,
      systemInfoMenuProvider,
      uiState
    } = this.props;

    const Menu = systemInfoMenuProvider ? systemInfoMenuProvider() : null;

    return (
      <SystemInfoTooltip position={getPosition(element)}>
        <InfoHeader>{system.getDisplayName()}</InfoHeader>
        {Menu && <Menu uiState={uiState} ship={ship} system={system} />}
        {system.getSystemInfo(ship).map(getEntry)}
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

const getPosition = element => {
  const boundingBox = element.getBoundingClientRect
    ? element.getBoundingClientRect()
    : element.get(0).getBoundingClientRect();

  const position = {};

  if (boundingBox.top > window.innerHeight / 2) {
    position.bottom = 32;
  } else {
    position.top = 32;
  }

  if (boundingBox.left > window.innerWidth / 2) {
    position.right = 0;
  } else {
    position.left = 0;
  }

  return position;
};

export default SystemInfo;
