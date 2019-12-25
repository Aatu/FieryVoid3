import React from "react";
import {
  TooltipHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue
} from "../../../../styled";
import coordinateConverter from "../../../../../model/utils/CoordinateConverter.mjs";

const getTorpedoTooltip = (shooter, target, torpedo, strikePrediction) => {
  if (strikePrediction) {
    const entries = [
      {
        value:
          "Following prediction depends on relative velocity, position of target, launched torpedo and is subject to change"
      },
      {
        header: `Impact in`,
        value: `+${strikePrediction.impactTurn} turns`
      },
      {
        header: "Relative velocity",
        value: `${strikePrediction.relativeVelocity} h/t`
      },

      {
        header: "Strike position",
        value: coordinateConverter
          .fromGameToHex(strikePrediction.impactPosition)
          .toString()
      },
      {
        header: "Strike effectiveness",
        value: `${Math.round(strikePrediction.effectiveness * 100)}%`
      }
    ];

    if (strikePrediction.note) {
      entries.push({
        value: strikePrediction.note
      });
    }

    return entries;
  }

  return [];
};

class TorpedoAttackTooltip extends React.Component {
  render() {
    const { shooter, target, torpedo, strikePrediction } = this.props;

    return (
      <>
        <TooltipHeader>Torpedo attack</TooltipHeader>
        {getTorpedoTooltip(shooter, target, torpedo, strikePrediction).map(
          getEntry
        )}
      </>
    );
  }
}

const getEntry = ({ header, value }, i) => {
  if (value.replace) {
    value = value.replace(/<br>/gm, "\n");
  }

  return (
    <TooltipEntry key={`cargoTooltipEntry-${header}-${i}`}>
      {header && <TooltipValueHeader>{header}: </TooltipValueHeader>}
      {value && <TooltipValue>{value}</TooltipValue>}
    </TooltipEntry>
  );
};

export default TorpedoAttackTooltip;
