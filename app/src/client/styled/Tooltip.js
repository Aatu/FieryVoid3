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
`;

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
  margin: 3px;
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
`;

export { Tooltip, TooltipHeader, TooltipEntry, TooltipMenu, TooltipButton };
