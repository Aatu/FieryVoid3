import styled from "styled-components";
import { Clickable } from "../../../../styled";

const Container = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;

  svg #svg-path {
    fill: white;
    ${props => props.overChannel && "fill:#4c7ca8;"}
    ${props => props.disabled && "fill: #8f2626;"}
  }
  ${Clickable}
`;

export default Container;
