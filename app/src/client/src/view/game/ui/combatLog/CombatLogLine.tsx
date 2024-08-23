import React from "react";
import styled from "styled-components";
import HitChance from "./HitChance";
import { Highlight, DangerHighlight } from "./styled";
import DamageLine from "./DamageLine";
import ReplayContext from "../../phase/phaseStrategy/AutomaticReplayPhaseStrategy/ReplayContext";
import GameData from "@fieryvoid3/model/src/game/GameData";
import CombatLogWeaponFire from "@fieryvoid3/model/src/combatLog/CombatLogWeaponFire";
import CombatLogTorpedoAttack from "@fieryvoid3/model/src/combatLog/CombatLogTorpedoAttack";
import WeaponFireService from "@fieryvoid3/model/src/weapon/WeaponFireService";

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

type Props = {
  combatLogEntry: CombatLogWeaponFire | CombatLogTorpedoAttack;
  gameData: GameData;
  replayContext: ReplayContext;
};

const CombatLogLine: React.FC<Props> = ({ combatLogEntry, gameData }) => {
  const getTorpedoAttackLine = () => {
    const torpedoLogEntry = combatLogEntry as CombatLogTorpedoAttack;

    const target = gameData.ships.getShipById(torpedoLogEntry.targetId);
    const flight = gameData.torpedos.getTorpedoFlightById(
      torpedoLogEntry.torpedoFlightId
    );

    if (!target || !flight) {
      return null;
    }

    const targetName = target.name?.trim() || "";

    return (
      <LineContainer>
        <SubLine>
          <DangerHighlight>TORPEDO STRIKE:&nbsp;</DangerHighlight>
          <Highlight>&nbsp;{flight.torpedo.getDisplayName()}&nbsp;</Highlight>
          strikes {targetName}
        </SubLine>
        {combatLogEntry.notes.length > 0 && (
          <IndentedSubline>{combatLogEntry.notes.join(". ")}</IndentedSubline>
        )}
        {combatLogEntry.damages.length > 0 && (
          <IndentedSubline>
            <DamageLine target={target} combatLogEntry={combatLogEntry} />
          </IndentedSubline>
        )}
      </LineContainer>
    );
  };

  const getWeaponFireLine = () => {
    const weaponLogEntry = combatLogEntry as CombatLogWeaponFire;

    const weaponFireService = new WeaponFireService().update(gameData);
    const fireOrder = weaponFireService.getFireOrderById(
      weaponLogEntry.fireOrderId
    );

    const target = gameData.ships.getShipById(fireOrder.targetId);
    const shooter = gameData.ships.getShipById(fireOrder.shooterId);
    const weapon = shooter.systems.getSystemById(fireOrder.weaponId);

    const hit = weaponLogEntry.getHitResult().result;
    const shooterName = shooter.name?.trim() || "Unknown shooter";
    const targetName = target.name?.trim() || "Unknown target";
    const weaponName = weapon.getDisplayName();

    return (
      <LineContainer>
        <SubLine>
          <DangerHighlight>FIRE:&nbsp;</DangerHighlight>
          {shooterName} fires{" "}
          <Highlight>
            &nbsp;{weaponName}&nbsp;
            {weaponLogEntry.ammoName && `(${weaponLogEntry.ammoName})`}&nbsp;
          </Highlight>{" "}
          at {targetName}.
          <HitChance
            resolution={weaponLogEntry.getHitResult()}
            totalShots={weaponLogEntry.totalShots}
            shotsHit={weaponLogEntry.shotsHit}
          />
        </SubLine>
        {combatLogEntry.notes.length > 0 && (
          <IndentedSubline>{combatLogEntry.notes.join(" ")}</IndentedSubline>
        )}
        {hit && (
          <IndentedSubline>
            <DamageLine target={target} combatLogEntry={combatLogEntry} />
          </IndentedSubline>
        )}
      </LineContainer>
    );
  };

  if (combatLogEntry instanceof CombatLogWeaponFire) {
    return getWeaponFireLine();
  } else if (combatLogEntry instanceof CombatLogTorpedoAttack) {
    return getTorpedoAttackLine();
  } else {
    return null;
  }
};

export default CombatLogLine;
