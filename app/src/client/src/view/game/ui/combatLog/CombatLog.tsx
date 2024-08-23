import React from "react";
import styled from "styled-components";
import CombatLogLine from "./CombatLogLine";
import ReplayContext from "../../phase/phaseStrategy/AutomaticReplayPhaseStrategy/ReplayContext";
import GameData from "@fieryvoid3/model/src/game/GameData";
import CombatLogWeaponFire from "@fieryvoid3/model/src/combatLog/CombatLogWeaponFire";
import CombatLogTorpedoAttack from "@fieryvoid3/model/src/combatLog/CombatLogTorpedoAttack";

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

type Props = {
  replayContext: ReplayContext;
  gameData: GameData;
  log: (CombatLogWeaponFire | CombatLogTorpedoAttack)[];
};

const CombatLog: React.FC<Props> = ({ replayContext, gameData, log }) => {
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
};

export default CombatLog;
