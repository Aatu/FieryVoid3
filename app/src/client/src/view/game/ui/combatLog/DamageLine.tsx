import React from "react";
import styled from "styled-components";
import { Highlight, DangerHighlight } from "./styled";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import CombatLogWeaponFire from "@fieryvoid3/model/src/combatLog/CombatLogWeaponFire";
import CombatLogTorpedoAttack from "@fieryvoid3/model/src/combatLog/CombatLogTorpedoAttack";

const DamageContainer = styled.div``;

type Props = {
  target: Ship;
  combatLogEntry: CombatLogWeaponFire | CombatLogTorpedoAttack;
};

const DamageLine: React.FC<Props> = ({ target, combatLogEntry }) => {
  const damages = combatLogEntry.getDamages(target);
  const systemsDestroyed = combatLogEntry.getDestroyedSystems(target);

  const totalDamage = damages.reduce((total, current) => {
    return total + current.amount;
  }, 0);

  const totalArmor = damages.reduce((total, current) => {
    return total + current.armor;
  }, 0);

  return (
    <DamageContainer>
      Damage caused: <DangerHighlight>{totalDamage}</DangerHighlight>. Mitigated
      by armor <Highlight>{totalArmor}</Highlight>.
      {systemsDestroyed.length > 0 && (
        <>
          {" "}
          Systems destroyed:{" "}
          <DangerHighlight>
            {systemsDestroyed
              .map((system) => system.getDisplayName())
              .join(", ")}
          </DangerHighlight>
        </>
      )}
    </DamageContainer>
  );
};

export default DamageLine;
