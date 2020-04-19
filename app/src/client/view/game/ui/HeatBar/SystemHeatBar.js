import React, { useState, useMemo } from "react";
import styled from "styled-components";
import HeatBar from "./HeatBar";
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
  ${TooltipEntry} {
    margin-left: 0;
  }
`;

const HeatBarContainer = styled.div``;

const SystemHeatBar = ({ className, system, currentOverheat, prediction }) => {
  const [details, setDetails] = useState(false);

  const {
    overheat,
    overheatPercentage,
    cooling,
    overHeatThreshold,
    newHeat,
    maximumPossibleOverheatReduction,
  } = prediction;

  const messages = useMemo(
    () =>
      details
        ? [
            {
              header: "Predicted cooling",
              value: cooling,
            },
            {
              header: "Predicted heat generation",
              value: newHeat,
            },
            {
              header: "Predicted overheat",
              value: `${overheat} (${Math.round(overheatPercentage * 100)}%)`,
            },
            {
              header: "Maximum overheat cooling",
              value: `${Math.round(maximumPossibleOverheatReduction * 100)}%`,
            },
          ]
        : [],
    [details, prediction]
  );

  return (
    <Container>
      <InlineTooltipEntry>
        <TooltipEntry noMargin>
          <TooltipValueHeader>Overheat: </TooltipValueHeader>
          <TooltipValue>
            {`${formatNumber(system.heat.getOverheat())}/${formatNumber(
              overHeatThreshold
            )} (${Math.round(system.heat.getOverheatPercentage() * 100)}%)`}
          </TooltipValue>
        </TooltipEntry>
        <TooltipEntry noMargin>
          <HeaderMenuItem onClick={() => setDetails(!details)} active={details}>
            ?
          </HeaderMenuItem>
        </TooltipEntry>
      </InlineTooltipEntry>
      <HeatBarContainer>
        <HeatBar
          className={className}
          percent={currentOverheat * 0.5}
          newPercent={overheatPercentage * 0.5}
          divider={0.5}
        />
      </HeatBarContainer>
      {buildTooltipEntries(messages, null, "")}
    </Container>
  );
};

export default SystemHeatBar;
