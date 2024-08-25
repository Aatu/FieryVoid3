import React, { useState, useMemo } from "react";
import styled from "styled-components";

import { HeatBar } from "./Bar";
import {
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  InlineTooltipEntry,
  TooltipBuilder,
} from "../../../../styled";
import { HeaderMenuItem } from "../system/SystemInfo";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import { HeatChangePrediction } from "@fieryvoid3/model/src/unit/system/SystemHeat";
import { formatNumber } from "@fieryvoid3/model/src/utils/format";

const Container = styled.div`
  ${TooltipEntry} {
    margin-left: 0;
  }
`;

const HeatBarContainer = styled.div``;

export type SystemHeatBarProps = {
  className?: string;
  system: ShipSystem;
  currentOverheat: number;
  prediction: HeatChangePrediction;
};

const SystemHeatBar: React.FC<SystemHeatBarProps> = ({
  className,
  system,
  currentOverheat,
  prediction,
}) => {
  const [details, setDetails] = useState(false);

  const {
    overheat,
    overheatPercentage,
    cooling,
    overHeatThreshold,
    newHeat,
    maximumPossibleOverheatReduction,
    maxCooling,
  } = prediction;

  const messages = useMemo(
    () =>
      details
        ? [
            {
              header: "Predicted cooling",
              value: `${Math.round(cooling)}/${Math.round(maxCooling)}`,
            },
            {
              header: "Predicted heat generation",
              value: Math.round(newHeat),
            },
            {
              header: "Predicted overheat",
              value: `${Math.round(overheat)} (${Math.round(
                overheatPercentage * 100
              )}%)`,
            },
            {
              header: "Maximum overheat cooling",
              value: `${Math.round(maximumPossibleOverheatReduction * 100)}%`,
            },
          ]
        : [],
    [
      cooling,
      details,
      maxCooling,
      maximumPossibleOverheatReduction,
      newHeat,
      overheat,
      overheatPercentage,
    ]
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
      <TooltipBuilder entries={messages} />
    </Container>
  );
};

export default SystemHeatBar;
