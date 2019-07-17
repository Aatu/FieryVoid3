import styled from "styled-components";
import { Clickable } from "../../../../styled";

const Container = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg #svg-path {
    fill: white;
    ${props => props.overChannel && "fill:#ffad3a;"}
    ${props => props.can === false && "fill:#ff0000;"}
  }
  ${Clickable}
`;

export default Container;
