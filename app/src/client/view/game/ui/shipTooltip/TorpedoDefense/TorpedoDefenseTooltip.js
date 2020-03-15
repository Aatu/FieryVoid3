import React from "react";
import {
  TooltipHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  buildTooltipEntries
} from "../../../../../styled";

const getTorpedoTooltip = (shooter, target, torpedoFlight) => {
  return [
    ...torpedoFlight.torpedo.damageStrategy.getAttackRunMessages({
      shooter,
      target,
      torpedoFlight
    })
  ];
};

class TorpedoDefenseTooltip extends React.Component {
  render() {
    const { shooter, target, torpedoFlight } = this.props;

    return (
      <>
        <TooltipHeader>TORPEDO DEFENSE</TooltipHeader>
        {buildTooltipEntries(getTorpedoTooltip(shooter, target, torpedoFlight))}
      </>
    );
  }
}

export default TorpedoDefenseTooltip;
