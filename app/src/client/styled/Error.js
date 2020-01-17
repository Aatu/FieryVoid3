import styled from "styled-components";
import { Section, colors } from ".";

const Error = styled(Section)`
  color: ${colors.textDanger};
  font-size: 12px;
  margin-top: 2px;
  height: 11px;
  overflow: hidden;
  font-weight: bolder;
`;

export { Error };
