import React from "react";
import {
  TooltipHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  buildTooltipEntries,
} from "../../../../../styled";

const getAttackRunMessages = (shooter, target, torpedoFlight) => {
  return [
    ...torpedoFlight.torpedo.damageStrategy.getAttackRunMessages({
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

const getInterceptors = (shooter, target, torpedoFlight, uiState) => {
  const interceptors = uiState.services.torpedoAttackService.getPossibleInterceptors(
    shooter,
    torpedoFlight
  );

  const interceptChance = interceptors
    .map((interceptor) => ({
      interceptor: interceptor,
      interceptChance: interceptor.callHandler("getInterceptChance", {
        target,
        torpedoFlight,
      }),
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

  const interceptorGroups = [];

  interceptChance.forEach((intercept) => {
    let entry = interceptorGroups.find(
      (group) => group.name === intercept.interceptor.getDisplayName()
    );

    if (!entry) {
      entry = {
        name: intercept.interceptor.getDisplayName(),
        min: null,
        max: null,
        amount: 0,
      };

      interceptorGroups.push(entry);
    }

    if (intercept.interceptChance.result < entry.min || entry.min === null) {
      entry.min = intercept.interceptChance.result;
    }

    if (intercept.interceptChance.result > entry.max || entry.max === null) {
      entry.max = intercept.interceptChance.result;
    }

    entry.amount++;
  });

  const getInterceptValue = (min, max) => {
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
      header: `${group.amount}x ${group.name}`,
      value: getInterceptValue(group.min, group.max),
    };
  });
};

class TorpedoDefenseTooltip extends React.Component {
  render() {
    const { shooter, target, torpedoFlight, uiState } = this.props;

    return (
      <>
        <TooltipHeader>TORPEDO DEFENSE</TooltipHeader>
        {buildTooltipEntries(
          getAttackRunMessages(shooter, target, torpedoFlight)
        )}

        <TooltipHeader>INTERCEPTORS</TooltipHeader>
        {buildTooltipEntries(
          getInterceptors(shooter, target, torpedoFlight, uiState)
        )}
      </>
    );
  }
}

export default TorpedoDefenseTooltip;
