import React from "react";
import styled from "styled-components";
import { Highlight, DangerHighlight } from "./styled";

const HitChanceContainer = styled.div`
  margin-left: 5px;
`;

class HitChance extends React.Component {
  render() {
    const { resolution, totalShots, shotsHit } = this.props;

    return (
      <HitChanceContainer>
        Change to hit: <Highlight>{resolution.hitChance.result}</Highlight>. Hit
        roll: <Highlight>{resolution.hitRoll}</Highlight>.
        {resolution.result ? (
          <Highlight>
            <b>{` ${shotsHit}/${totalShots} Hit!`}</b>
          </Highlight>
        ) : (
          <DangerHighlight>
            <b> Miss!</b>
          </DangerHighlight>
        )}
      </HitChanceContainer>
    );
  }
}

export default HitChance;
