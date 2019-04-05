import styled from "styled-components";
import { Section, colors } from ".";

const Error = styled(Section)`
  color: ${colors.textDanger};
  font-size: 10px;
  margin-top: 2px;
  height: 11px;
  overflow: hidden;
  font-family: bookman;
  text-transform: uppercase;
`;

export { Error };
