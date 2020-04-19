import React, { useMemo } from "react";
import styled from "styled-components";
import {
  systemWindowPrimaryBorder,
  lightBlue,
  textDanger,
  mediumBlue,
  hitpoints,
  hitpointsCritical,
  red,
} from "../../../../styled/Colors";

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const BarContainer = styled.div`
    width: 100%
    border: 1px solid ${systemWindowPrimaryBorder};
    display: flex;
    height: 10px;
    position: relative;
`;

const Bar = styled.div`
  height: 8px;
  margin: 1px;
  width: ${({ percent }) => `calc(${percent * 100}% - 2px);`};
  background-color: ${hitpointsCritical};
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 2;
`;

const ChangeBar = styled(Bar)`
  background-color: ${({ more }) => (more ? red : hitpoints)};
  z-index: ${({ more }) => (more ? 1 : 3)};
  ${({ more, oldPercent, percent }) =>
    !more &&
    `width:calc(${(oldPercent - percent) * 100}% - 2px); left:calc(${
      percent * 100
    }% - 0px);`}
`;

const DividerBar = styled(Bar)`
  border-right: 3px solid white;
  margin: 0 1px;
  background-color: transparent;
  height: 100%;
  z-index: 4;
`;

const HeatBar = ({ percent, newPercent, divider = null }) => {
  if (percent > 1) {
    percent = 1;
  }

  if (newPercent > 1) {
    newPercent = 1;
  }

  return (
    <Container>
      <BarContainer>
        <Bar percent={percent} />
        {newPercent !== undefined && (
          <ChangeBar
            percent={newPercent}
            oldPercent={percent}
            more={newPercent > percent}
          />
        )}
        {Boolean(divider) && <DividerBar percent={divider} />}
      </BarContainer>
    </Container>
  );
};

export default HeatBar;
