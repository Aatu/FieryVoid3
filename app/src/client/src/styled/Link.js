import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";

export const Link = styled(RouterLink)`
  text-decoration: none;
  width: 100%;
  display: flex;
`;

export const LinkInline = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
`;
