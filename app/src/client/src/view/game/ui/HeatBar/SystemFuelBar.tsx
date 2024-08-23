import React from "react";
import styled from "styled-components";

import {
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
} from "../../../../styled";
import { FuelBar } from "./Bar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 8px;

  ${TooltipEntry} {
    display: flex;
    flex-grow: 1;
    margin-left: 0;
    margin-right: 0;
  }
`;

const FuelBarContainer = styled.div`
  display: flex;
  flex-grow: 1;
`;

const SystemFuelBar: React.FC<{ space: number; fuel: number }> = ({
  space,
  fuel,
}) => {
  const percent = fuel / space;

  return (
    <Container>
      <TooltipEntry>
        <TooltipValueHeader>Fuel: </TooltipValueHeader>
        <TooltipValue>{`${fuel}/${space}`}</TooltipValue>
      </TooltipEntry>
      <FuelBarContainer>
        <FuelBar percent={percent} />
      </FuelBarContainer>
    </Container>
  );
};

export default SystemFuelBar;
