import * as React from "react";
import styled, { css } from "styled-components";
import { colors } from "./index";
import { tooltipButtonColor } from "./Colors";

class Component extends React.Component {
  render() {
    const { children, className } = this.props;
    return <div className={className}>{children}</div>;
  }
}

const TooltipContainer = styled(Component)`
  opacity: 0.95;
  text-align: center;
  font-family: arial;
  font-size: 12px;
  color: white;
  background-color: black;
  border-radius: 7px;
  -moz-border-radius: 7px;
  -webkit-border-radius: 7px;
  padding: 3px 8px 8px 8px;
  border: 1px solid #121212;
  filter: brightness(1);
  cursor: initial;
`;

const Tooltip = styled(TooltipContainer)`
  z-index: 7001;
  position: absolute;
`;

const RelativeTooltipContainer = styled(Tooltip)`
  position: absolute;
  z-index: 20000;
  ${props =>
    Object.keys(props.position).reduce((style, key) => {
      return style + "\n" + key + ":" + props.position[key] + "px;";
    }, "")}
  text-align: left;
  filter: brightness(1);
`;

const TooltipValue = styled.div`
  color: ${colors.lightBlue};
`;

export class RelativeTooltip extends React.Component {
  render() {
    const { element, children, ...rest } = this.props;

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

    return (
      <RelativeTooltipContainer position={getPosition(element)} {...rest}>
        {children}
      </RelativeTooltipContainer>
    );
  }
}

const TooltipHeader = styled.div`
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  border-bottom: 1px solid #aaaaaa;
  width: calc(100% - 16px);
  margin: 5px 8px;
  font-weight: bold;
  font-size: 12px;
`;

const TooltipSubHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #aaaaaa;
  width: calc(100% - 16px);
  margin: 5px 8px;
  font-weight: bold;
  font-size: 12px;
  color: ${colors.lightBlue};
`;

const TooltipValueHeader = styled.div`
  padding-right: 5px;
  color: white;
`;

const TooltipEntry = styled.div`
  display: flex;
  box-sizing: border-box;
  margin: 2px 8px;

  ${props => props.noMargin && "margin: 0;"}
  font-weight: ${props => (props.important ? "bold" : "inherit")};
  font-size: ${props => (props.important ? "14px" : "11px")};
  ${props => props.space && "margin-top: 14px"};
  text-align: left;
  color: #5e85bc;
  font-family: arial;
  
  ${props =>
    props.clickable &&
    css`
      cursor: pointer;
      color: white;
      background-color: ${tooltipButtonColor};
      border: 1px solid black;
    `}

  &:hover {
    ${props =>
      props.clickable &&
      css`
        border: 1px solid white;
      `}
  }
`;

const CenteredTooltipEntry = styled(TooltipEntry)`
  justify-content: center;
  ${TooltipValueHeader} {
    padding-right: 0;
  }
`;

const InlineTooltipEntry = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TooltipMenu = styled.div`
  margin: 0 8px;
  display: flex;
`;

const selectedTooltipButton = css`
  filter: brightness(5) grayscale(100%);
  opacity: 1;
`;

const disabledTooltipButton = css`
  filter: brightness(0.25) grayscale(100%);
`;

const hoverTooltipButton = css`
  opacity: 1;
  filter: brightness(5) grayscale(100%);
`;

const TooltipButton = styled.button`
  border: none;
  width: 40px;
  height: 40px;
  background-color: transparent;
  margin: 0;
  cursor: pointer;
  background-image: ${props => props.img && `url(${props.img})`};
  background-size: cover;
  opacity: 0.5;
  filter: brightness(3) grayscale(100%);

  ${props => props.selected && !props.disabled && selectedTooltipButton}

  ${props => props.disabled && disabledTooltipButton}

  &:hover {
    ${props => !props.disabled && hoverTooltipButton}
  }

  &:focus {
    outline: 0;
  }

  svg #svg-path {
    fill: white;
    ${props => props.disabled && "fill:#ff0000;"}
  }
`;

const buildTooltipEntries = (entries, subKey = "") => {
  return entries
    .sort((a, b) => {
      if (!a.sort && b.sort) {
        return 1;
      }

      if (a.sort && !b.sort) {
        return -1;
      }

      if (a.sort > b.sort) {
        return 1;
      }

      if (a.sort < b.sort) {
        return -1;
      }

      return 0;
    })
    .map(({ value, header }, index) => {
      if (value && value.replace) {
        value = value.replace(/<br>/gm, "\n");
      }

      return (
        <TooltipEntry
          noMargin={subKey !== ""}
          key={`shiptoolitip-${index}-${subKey}`}
        >
          {header && <TooltipValueHeader>{header}: </TooltipValueHeader>}
          {value && Array.isArray(value) && (
            <InlineTooltipEntry>
              {buildTooltipEntries(value, subKey + "-" + index)}
            </InlineTooltipEntry>
          )}
          {value && !Array.isArray(value) && (
            <TooltipValue>{value}</TooltipValue>
          )}
        </TooltipEntry>
      );
    });
};

export {
  TooltipContainer,
  buildTooltipEntries,
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  TooltipMenu,
  TooltipButton,
  TooltipSubHeader,
  TooltipValue,
  TooltipValueHeader,
  InlineTooltipEntry,
  CenteredTooltipEntry
};
