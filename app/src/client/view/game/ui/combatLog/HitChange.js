import React from "react";
import styled from "styled-components";
import { Highlight, DangerHighlight } from "./styled";

const HitChangeContainer = styled.div`
  margin-left: 5px;
`;

class HitChange extends React.Component {
  render() {
    const { resolution } = this.props;
    console.log(resolution);

    return (
      <HitChangeContainer>
        Change to hit: <Highlight>{resolution.hitChange.result}</Highlight>. Hit
        roll: <Highlight>{resolution.hitRoll}</Highlight>.
        {resolution.result ? (
          <Highlight>
            <b> Hit!</b>
          </Highlight>
        ) : (
          <DangerHighlight>
            <b> Miss!</b>
          </DangerHighlight>
        )}
      </HitChangeContainer>
    );
  }
}

export default HitChange;
