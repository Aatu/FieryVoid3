import React from "react";

import {
  IconAndLabel,
  TooltipHeader,
  TooltipSubHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  InlineTooltipEntry,
  CenteredTooltipEntry,
  TooltipButton,
  colors
} from "../../../../../../styled";
import styled from "styled-components";
import CargoItem from "../cargo/CargoItem";
import NoAmmunitionLoaded from "../../../../../../../model/unit/system/weapon/ammunition/NoAmmunitionLoaded.mjs";

const RangeContainer = styled.div`
  display: flex;
  width: 100%;
  height: 32px;
  align-items: flex-end;
`;

const RangeNumbersContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const RangeStep = styled.div`
  width: 1%;
  height: 100%;
  background-image: url("/img/lightBluePixel.png");
  background-size: 100% ${props => `${props.height}%`};
  background-repeat: no-repeat;
  background-position: bottom 0 left 0;
  opacity: 0.25;

  &:hover {
    opacity: 0.5;
  }
`;

class RangePenalty extends React.Component {
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
  render() {
    const { rangeStrategy } = this.props;

    const step = getMaxRange(rangeStrategy) / 100;
    const steps = [];
    for (let i = 0; i < 100; i++) {
      const rangePenalty = rangeStrategy.getRangeModifier({
        distance: i * step
      });

      steps.push({
        range: i,
        rangePenalty,
        height: Math.abs(rangePenalty / 200) * 100
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
  }
}

const getMaxRange = rangeStrategy => {
  const ranges = rangeStrategy.rangesAndPenalties;
  return ranges[ranges.length - 1].range;
};

export default RangePenalty;
