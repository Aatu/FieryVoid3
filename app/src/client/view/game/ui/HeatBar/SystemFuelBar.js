import React, { useState, useMemo } from "react";
import styled from "styled-components";

import {
  buildTooltipEntries,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  InlineTooltipEntry,
} from "../../../../styled";
import { formatNumber } from "../../../../../model/utils/format.mjs";
import { HeaderMenuItem } from "../system/SystemInfo";
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

const SystemFuelBar = ({ space, fuel }) => {
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
