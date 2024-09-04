import React from "react";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import TorpedoFlight from "@fieryvoid3/model/src/unit/TorpedoFlight";
import UIState from "../../UIState";
/*
const getAttackRunMessages = (
  shooter: Ship,
  target: Ship,
  torpedoFlight: TorpedoFlight
) => {
  return [
    ...torpedoFlight.torpedo.getDamageStrategy().getAttackRunMessages({
      shooter,
      target,
      torpedoFlight,
    }),
    {
      header: "CCEW",
      value: shooter.electronicWarfare.getCcEw(),
    },
  ];
};

type InterceptorGroup = {
  name: string;
  intercepts: number;
  min: number;
  max: number;
  amount: number;
};

const getInterceptors = (
  shooter: Ship,
  target: Ship,
  torpedoFlight: TorpedoFlight,
  uiState: UIState
) => {
  const interceptors = uiState
    .getServices()
    .torpedoAttackService.getPossibleInterceptors(shooter, torpedoFlight);

  const interceptChance = interceptors
    .map((interceptor) => ({
      interceptor: interceptor,
      interceptChance: interceptor.callHandler(
        SYSTEM_HANDLERS.getInterceptChance,
        {
          target,
          torpedoFlight,
        },
        null as unknown as WeaponHitChance
      ),
    }))
    .sort((a, b) => {
      if (a.interceptChance.result > b.interceptChance.result) {
        return 1;
      }

      if (a.interceptChance.result < b.interceptChance.result) {
        return -1;
      }

      return 0;
    });

  const interceptorGroups: InterceptorGroup[] = [];

  interceptChance.forEach((intercept) => {
    let entry = interceptorGroups.find(
      (group) => group.name === intercept.interceptor.getDisplayName()
    );

    if (!entry) {
      entry = {
        name: intercept.interceptor.getDisplayName()!,
        intercepts: intercept.interceptor.callHandler(
          SYSTEM_HANDLERS.getNumberOfIntercepts,
          null,
          1
        ),
        min: 0,
        max: Number.MAX_VALUE,
        amount: 0,
      };

      interceptorGroups.push(entry);
    }

    if (intercept.interceptChance.result < entry.min || entry.min === null) {
      entry.min = Math.round(intercept.interceptChance.result);
    }

    if (intercept.interceptChance.result > entry.max || entry.max === null) {
      entry.max = Math.round(intercept.interceptChance.result);
    }

    entry.amount++;
  });

  const getInterceptValue = (min: number, max: number) => {
    if (min < 0) {
      min = 0;
    }

    if (max < 0) {
      max = 0;
    }

    if (min === max) {
      return `${max}%`;
    }

    return `${min}% - ${max}%`;
  };

  return interceptorGroups.map((group) => {
    return {
      header: `${group.amount * group.intercepts}x ${group.name}`,
      value: getInterceptValue(group.min, group.max),
    };
  });
};

*/
type Props = {
  shooter: Ship;
  target: Ship;
  torpedoFlight: TorpedoFlight;
  uiState: UIState;
};

const TorpedoDefenseTooltip: React.FC<Props> = (/*{
  shooter,
  target,
  torpedoFlight,
  uiState,
}*/) => {
  /*
  const interceptorEntries = getInterceptors(
    shooter,
    target,
    torpedoFlight,
    uiState
  );

  return (
    <>
      <TooltipHeader>TORPEDO DEFENSE</TooltipHeader>
      <TooltipBuilder
        entries={getAttackRunMessages(shooter, target, torpedoFlight)}
      ></TooltipBuilder>

      <TooltipHeader>INTERCEPTORS</TooltipHeader>
      {interceptorEntries.length > 0 ? (
        <TooltipBuilder entries={interceptorEntries} />
      ) : (
        "No available interceptors"
      )}
    </>
  );
  */

  return null;
};

export default TorpedoDefenseTooltip;
