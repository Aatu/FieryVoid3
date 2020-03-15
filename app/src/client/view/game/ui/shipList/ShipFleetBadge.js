import React from "react";
import styled from "styled-components";
import ShipName from "../ShipName";
import {
  TooltipContainer,
  TooltipHeader,
  TooltipValue,
  TooltipValueHeader
} from "../../../../styled";

const Container = styled(TooltipContainer)`
  width: 200px;
  box-sizing: border-box;
  text-align: left;

  margin-top: 5px;

  &:first-child {
    margin-top: 0;
  }
`;

const Header = styled(TooltipHeader)`
  border-bottom: none;
`;

const Fleet = styled(TooltipValueHeader)`
  padding-left: 8px;
`;

export default function ShipFleetBadge({ ship }) {
  return (
    <Container>
      <Header>
        <ShipName ship={ship} />
      </Header>
      <Fleet>Second fleet</Fleet>
    </Container>
  );
}
