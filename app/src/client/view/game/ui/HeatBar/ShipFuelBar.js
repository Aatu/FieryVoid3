import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { FuelBar } from "./Bar";
import {
  buildTooltipEntries,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  InlineTooltipEntry,
} from "../../../../styled";
import { formatNumber } from "../../../../../model/utils/format.mjs";
import { HeaderMenuItem } from "../system/SystemInfo";

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

const ShipFuelBar = ({ fuel, space, newFuel }) => {
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
