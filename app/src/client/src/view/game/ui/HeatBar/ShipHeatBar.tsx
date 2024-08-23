import React from "react";
import styled from "styled-components";
import { HeatBar } from "./Bar";
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

const ShipHeatBar: React.FC<{ percent: number; newPercent: number }> = ({
  percent,
  newPercent,
}) => {
  return (
    <Container>
      <TooltipEntry>
        <TooltipEntry noMargin>
          <TooltipValueHeader>Heat: </TooltipValueHeader>
        </TooltipEntry>
        <HeatBar percent={percent} newPercent={newPercent} />
      </TooltipEntry>
    </Container>
  );
};

export default ShipHeatBar;
