import React from "react";
import styled from "styled-components";
import { Highlight, DangerHighlight } from "./styled";

const DamageContainer = styled.div``;

class DamageLine extends React.Component {
  render() {
    const { combatLogEntry } = this.props;
    console.log(combatLogEntry);

    const systemsDestroyed = combatLogEntry.getSystemsDestroyed();
    console.log("systemsDestroyed", systemsDestroyed);
    return (
      <DamageContainer>
        Damage caused:{" "}
        <DangerHighlight>{combatLogEntry.getTotalDamage()}</DangerHighlight>.
        Mitigated by armor{" "}
        <Highlight>{combatLogEntry.getTotalArmor()}</Highlight>.
        {systemsDestroyed.length > 0 && (
          <>
            {" "}
            Systems destroyed:{" "}
            {systemsDestroyed.map(system => (
              <DangerHighlight>{system.getDisplayName()}</DangerHighlight>
            ))}
          </>
        )}
      </DamageContainer>
    );
  }
}

export default DamageLine;
