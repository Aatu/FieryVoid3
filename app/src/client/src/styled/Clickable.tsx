import { css } from "styled-components";

const Clickable = css<{ disabled?: boolean }>`
  ${(props) => !props.disabled && "cursor: pointer;"}

  &:hover {
    text-shadow: white 0 0 10px, white 0 0 3px;
    opacity: 2;
    ${(props) => props.disabled && "opacity: 0.5;"}
    color: #deebff;
  }
`;

export { Clickable };
