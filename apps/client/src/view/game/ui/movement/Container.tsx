import styled, { css } from "styled-components";
import { Clickable } from "../../../../styled";
import { ClickableProps } from "../../../../styled/Clickable";

export type ContainerProps = {
  $overChannel?: boolean;
  disabled?: boolean;
  $active?: boolean;
};

const Container = styled.div<ContainerProps & ClickableProps>`
  position: absolute;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;

  svg #svg-path {
    fill: white;
    ${(props) => props.$overChannel && "fill:#4c7ca8;"}
    ${(props) => props.disabled && "fill: #8f2626;"}
  }
  ${Clickable}

  ${(props) =>
    props.$active &&
    css`
      animation: blinker 1s linear infinite;

      @keyframes blinker {
        50% {
          opacity: 0;
        }
      }
    `}
`;

export default Container;
