import React from "react";
import styled from "styled-components";
import { Highlight, DangerHighlight } from "./styled";

const DamageContainer = styled.div``;

class DamageLine extends React.Component {
  render() {
    const { target, gameData, combatLogEntry } = this.props;

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
        Damage caused: <DangerHighlight>{totalDamage}</DangerHighlight>.
        Mitigated by armor <Highlight>{totalArmor}</Highlight>.
        {systemsDestroyed.length > 0 && (
          <>
            {" "}
            Systems destroyed:{" "}
            <DangerHighlight>
              {systemsDestroyed
                .map(system => system.getDisplayName())
                .join(", ")}
            </DangerHighlight>
          </>
        )}
      </DamageContainer>
    );
  }
}

export default DamageLine;
