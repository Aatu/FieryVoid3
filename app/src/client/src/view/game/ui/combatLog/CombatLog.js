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
  z-index: 3;
  scrollbar-width: 0;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

class CombatLog extends React.Component {
  render() {
    const { replayContext, gameData, log } = this.props;

    return (
      <LogContainer>
        {log.map((logEntry, i) => (
          <CombatLogLine
            gameData={gameData}
            replayContext={replayContext}
            key={`combatlog-line-${i}`}
            combatLogEntry={logEntry}
          />
        ))}
      </LogContainer>
    );
  }
}

export default CombatLog;
