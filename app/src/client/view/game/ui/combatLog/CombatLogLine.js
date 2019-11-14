import React from "react";
import styled from "styled-components";
import HitChange from "./HitChange";
import { Highlight, DangerHighlight } from "./styled";
import DamageLine from "./DamageLine";

const LineContainer = styled.div`
  color: #d6d6d6;
  font-family: arial;
  font-size: 12px;
  padding: 8px 8px 8px 8px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px dashed gray;
`;

const SubLine = styled.div`
  display: flex;
`;

const IndentedSubline = styled(SubLine)`
  margin-left: 50px;
  margin-top: 4px;
`;

class CombatLogLine extends React.Component {
  render() {
    const { combatLogEntry } = this.props;

    const hit = combatLogEntry.fireOrder.result.getHitResolution().result;
    const shooterName = combatLogEntry.shooter.name.trim();
    const targetName = combatLogEntry.target.name.trim();
    const weaponName = combatLogEntry.weapon.getDisplayName();

    return (
      <LineContainer>
        <SubLine>
          <DangerHighlight>FIRE:&nbsp;</DangerHighlight>
          {shooterName} fires <Highlight>&nbsp;{weaponName}&nbsp;</Highlight> at{" "}
          {targetName}.
          <HitChange
            resolution={combatLogEntry.fireOrder.result.getHitResolution()}
          />
        </SubLine>
        {hit && (
          <IndentedSubline>
            <DamageLine combatLogEntry={combatLogEntry} />
          </IndentedSubline>
        )}
      </LineContainer>
    );
  }
}

export default CombatLogLine;
