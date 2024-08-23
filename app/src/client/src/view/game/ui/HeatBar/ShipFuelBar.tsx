import React from "react";
import styled from "styled-components";
import { FuelBar } from "./Bar";
import { TooltipEntry, TooltipValueHeader } from "../../../../styled";

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  ${TooltipEntry} {
    width: 50px;
    display: flex;
    flex-grow: 1;
    margin-left: 0;
    margin-right: 0;
  }
`;

const ShipFuelBar: React.FC<{
  fuel: number;
  space: number;
  newFuel: number;
}> = ({ fuel, space, newFuel }) => {
  const percent = fuel / space;
  const newPercent = newFuel / space;
  return (
    <Container>
      <TooltipEntry>
        <TooltipEntry noMargin>
          <TooltipValueHeader>Fuel: </TooltipValueHeader>
        </TooltipEntry>
        <FuelBar percent={percent} newPercent={newPercent} />
      </TooltipEntry>
    </Container>
  );
};

export default ShipFuelBar;
