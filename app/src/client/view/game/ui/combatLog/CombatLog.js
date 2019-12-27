import React from "react";
import styled from "styled-components";
import CombatLogLine from "./CombatLogLine";

const LogContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  height: 150px;
  width: 33%;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  padding-top: 8px;
`;

class CombatLog extends React.Component {
  render() {
    const { replayContext, gameData } = this.props;

    return null;

    replayContext.getCombatLog(gameData);

    return (
      <LogContainer>
        {replayContext.getCombatLog(gameData).map((logEntry, i) => (
          <CombatLogLine
            key={`combatlog-line-${i}`}
            combatLogEntry={logEntry}
          />
        ))}
      </LogContainer>
    );
  }
}

export default CombatLog;
