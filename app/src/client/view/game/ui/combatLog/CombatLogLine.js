import React from "react";
import styled from "styled-components";
import HitChange from "./HitChange";
import { Highlight, DangerHighlight } from "./styled";
import DamageLine from "./DamageLine";
import CombatLogWeaponFire from "../../../../../model/combatLog/CombatLogWeaponFire.mjs";
import WeaponFireService from "../../../../../model/weapon/WeaponFireService.mjs";

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
  getWeaponFireLine() {
    const { combatLogEntry, gameData, replayContext } = this.props;

    const weaponFireService = new WeaponFireService().update(gameData);
    const fireOrder = weaponFireService.getFireOrderById(
      combatLogEntry.fireOrderId
    );
    const target = gameData.ships.getShipById(fireOrder.targetId);
    const shooter = gameData.ships.getShipById(fireOrder.shooterId);
    const weapon = shooter.systems.getSystemById(fireOrder.weaponId);

    const hit = combatLogEntry.hitResult.result;
    const shooterName = shooter.name.trim();
    const targetName = target.name.trim();
    const weaponName = weapon.getDisplayName();

    return (
      <LineContainer>
        <SubLine>
          <DangerHighlight>FIRE:&nbsp;</DangerHighlight>
          {shooterName} fires <Highlight>&nbsp;{weaponName}&nbsp;</Highlight> at{" "}
          {targetName}.
          <HitChange resolution={combatLogEntry.hitResult} />
        </SubLine>
        {hit && (
          <IndentedSubline>
            <DamageLine
              target={target}
              gameData={gameData}
              combatLogEntry={combatLogEntry}
            />
          </IndentedSubline>
        )}
      </LineContainer>
    );
  }

  render() {
    const { combatLogEntry } = this.props;

    if (combatLogEntry instanceof CombatLogWeaponFire) {
      return this.getWeaponFireLine();
    } else {
      return null;
    }
  }
}

export default CombatLogLine;
