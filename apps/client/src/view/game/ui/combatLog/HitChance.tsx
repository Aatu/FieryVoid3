import React from "react";
import styled from "styled-components";
import { Highlight, DangerHighlight } from "./styled";
import CombatLogWeaponFireHitResult from "@fieryvoid3/model/src/combatLog/CombatLogWeaponFireHitResult";

const HitChanceContainer = styled.div`
  margin-left: 5px;
`;

type Props = {
  resolution: CombatLogWeaponFireHitResult;
  totalShots: number;
  shotsHit: number;
};

const HitChance: React.FC<Props> = ({ resolution, totalShots, shotsHit }) => {
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
};

export default HitChance;
