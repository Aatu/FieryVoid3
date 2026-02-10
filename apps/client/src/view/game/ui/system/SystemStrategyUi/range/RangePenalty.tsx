import React from "react";

import {
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
} from "../../../../../../styled";
import styled from "styled-components";
import { StandardRangeStrategy } from "@fieryvoid3/model/src/unit/system/strategy";

const RangeContainer = styled.div`
  display: flex;
  width: calc(100% - 16px);
  height: 32px;
  align-items: flex-end;
  margin: 0 8px;
`;

const RangeNumbersContainer = styled.div`
  width: calc(100% - 16px);
  margin: 0 8px;
  display: flex;
  justify-content: space-between;
`;

type RangeStepProps = {
  height: number;
};

const RangeStep = styled.div<RangeStepProps>`
  width: 1%;
  height: 100%;
  background-image: url("/img/lightBluePixel.png");
  background-size: 100% ${(props) => `${props.height}%`};
  background-repeat: no-repeat;
  background-position: bottom 0 left 0;
  opacity: 0.25;
  filter: blur(1px);

  &:hover {
    opacity: 0.5;
  }
`;
export type RangePenaltyProps = {
  rangeStrategy: StandardRangeStrategy;
};

const RangePenalty: React.FC<{ rangeStrategy: StandardRangeStrategy }> = ({
  rangeStrategy,
}) => {
  /*
  constructor(props) {
    super(props);

    this.state = { mouseOveredStep: null };
  }
  systemChangedCallback(ship, system) {
    if (
      ship.id === this.props.ship.id &&
      system.id === this.props.rangeStrategy.system.id
    ) {
      this.forceUpdate();
    }
  }

  componentDidMount() {
    const { uiState } = this.props;
    this.systemChangedCallbackInstance = this.systemChangedCallback.bind(this);
    uiState.subscribeToSystemChange(this.systemChangedCallbackInstance);
  }

  componentWillUnmount() {
    const { uiState } = this.props;
    uiState.unsubscribeFromSystemChange(this.systemChangedCallbackInstance);
  }
*/

  const step = getMaxRange(rangeStrategy) / 100;
  const steps = [];
  for (let i = 0; i < 100; i++) {
    const rangePenalty = rangeStrategy.getRangeModifier({
      distance: i * step,
    });

    steps.push({
      range: i,
      rangePenalty,
      height: Math.abs(rangePenalty / 200) * 100,
    });
  }

  return (
    <>
      <TooltipEntry>
        <TooltipValueHeader>Range penalty:</TooltipValueHeader>
      </TooltipEntry>
      <RangeContainer>
        {steps.map((entry, i) => (
          <RangeStep key={`rangestep-${i}`} height={entry.height} />
        ))}
      </RangeContainer>
      <RangeNumbersContainer>
        <TooltipValue>0</TooltipValue>
        <TooltipValue>distance</TooltipValue>
        <TooltipValue>{getMaxRange(rangeStrategy)}</TooltipValue>
      </RangeNumbersContainer>
    </>
  );
};

const getMaxRange = (rangeStrategy: StandardRangeStrategy) => {
  const ranges = rangeStrategy.getRangesAndPenalties();
  return ranges[ranges.length - 1].range;
};

export default RangePenalty;
