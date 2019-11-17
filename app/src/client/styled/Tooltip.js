import * as React from "react";
import styled, { css } from "styled-components";

class Component extends React.Component {
  render() {
    const { children, className } = this.props;
    return <div className={className}>{children}</div>;
  }
}

const Tooltip = styled(Component)`
  z-index: 7001;
  opacity: 0.95;
  position: absolute;
  text-align: center;
  font-family: arial;
  font-size: 12px;
  color: white;
  background-color: black;
  border-radius: 7px;
  -moz-border-radius: 7px;
  -webkit-border-radius: 7px;
  padding: 3px 15px 3px 15px;
  padding-bottom: 8px;
  border: 1px solid #121212;
  filter: brightness(1);
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
  text-transform: uppercase;
  font-size: 16px;
  border-bottom: 1px solid #aaaaaa;
  width: 100%;
  margin: 5px 0;
  font-weight: bold;
`;

const TooltipEntry = styled.div`
    color: ${props => {
      if (props.type === "good") {
        return "#6fc126;";
      } else if (props.type === "bad") {
        return "#ff7b3f;";
      } else {
        return "white;";
      }
    }}
    font-weight: ${props => (props.important ? "bold" : "inherit")};
    font-size: ${props => (props.important ? "14px" : "12px")};
    margin-top: ${props => (props.space ? "14px" : "0")};
`;

const TooltipMenu = styled.div`
  display: flex;
`;

const selectedTooltipButton = css`
  filter: brightness(5) grayscale(100%);
  opacity: 1;
`;

const disabledTooltipButton = css`
  filter: brightness(1) grayscale(100%);
  opacity: 0.5;
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

export { Tooltip, TooltipHeader, TooltipEntry, TooltipMenu, TooltipButton };
