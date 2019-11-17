import React from "react";
import styled from "styled-components";
import { Highlight, DangerHighlight } from "./styled";

const DamageContainer = styled.div``;

class DamageLine extends React.Component {
  render() {
    const { combatLogEntry } = this.props;

    const systemsDestroyed = combatLogEntry.getSystemsDestroyed();
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
            {systemsDestroyed.map((system, i) => (
              <DangerHighlight key={`system-destroyed-${i}`}>
                {system.getDisplayName()}
              </DangerHighlight>
            ))}
          </>
        )}
      </DamageContainer>
    );
  }
}

export default DamageLine;
