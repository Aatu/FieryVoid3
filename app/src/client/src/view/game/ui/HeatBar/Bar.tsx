import React from "react";
import styled from "styled-components";
import {
  systemWindowPrimaryBorder,
  hitpoints,
  hitpointsCritical,
  red,
  fuel,
} from "../../../../styled/Colors";

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const BarContainer = styled.div`
  width: 100%;
  border: 1px solid ${systemWindowPrimaryBorder};
  display: flex;
  height: 10px;
  position: relative;
`;

type BarProps = {
  $percent: number;
  $color?: string;
};

const Bar = styled.div<BarProps>`
  height: 8px;
  margin: 1px;
  width: ${({ $percent }) => `calc(${$percent * 100}% - 2px);`};
  background-color: ${({ $color }) => $color || "transparent"};
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 2;
`;

type ChangeBarProps = {
  $more: boolean;
  $oldPercent: number;
  $percent: number;
  $barDecreaseColor: string;
  $barIncreaseColor: string;
};

const ChangeBar = styled(Bar)<ChangeBarProps>`
  background-color: ${({ $more, $barDecreaseColor, $barIncreaseColor }) =>
    $more ? $barIncreaseColor : $barDecreaseColor};
  z-index: ${({ $more }) => ($more ? 1 : 3)};
  ${({ $more, $oldPercent, $percent }) =>
    !$more &&
    `width:calc(${($oldPercent - $percent) * 100}% - 2px); left:calc(${
      $percent * 100
    }% - 0px);`}
`;

const DividerBar = styled(Bar)`
  border-right: 3px solid white;
  margin: 0 1px;
  background-color: transparent;
  height: 100%;
  z-index: 4;
`;

type HeatProps = {
  className?: string;
  percent: number;
  newPercent?: number;
  divider?: number;
  barColor?: string;
  barDecreaseColor?: string;
  barIncreaseColor?: string;
};

const HeatBar: React.FC<HeatProps> = ({
  className,
  percent,
  newPercent,
  divider = null,
  barColor = hitpointsCritical,
  barDecreaseColor = hitpoints,
  barIncreaseColor = red,
}) => {
  if (percent > 1) {
    percent = 1;
  }

  if (newPercent !== undefined && newPercent > 1) {
    newPercent = 1;
  }

  if (newPercent !== undefined && newPercent < 0) {
    newPercent = 0;
  }

  return (
    <Container className={className}>
      <BarContainer>
        <Bar $percent={percent} $color={barColor} />
        {newPercent !== undefined && (
          <ChangeBar
            $percent={newPercent}
            $oldPercent={percent}
            $more={newPercent > percent}
            $barDecreaseColor={barDecreaseColor}
            $barIncreaseColor={barIncreaseColor}
            $color="transparent"
          />
        )}
        {Boolean(divider) && <DividerBar $percent={divider!} />}
      </BarContainer>
    </Container>
  );
};

type FuelProps = {
  percent: number;
  newPercent?: number;
  divider?: number;
};

const FuelBar: React.FC<FuelProps> = (props) => {
  return (
    <HeatBar
      {...props}
      barColor={fuel}
      barIncreaseColor={hitpoints}
      barDecreaseColor={red}
    />
  );
};

export { HeatBar, FuelBar };
