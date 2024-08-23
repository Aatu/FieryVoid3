import React from "react";
import { TooltipHeader } from "../../../../styled";
import Ship from "@fieryvoid3/model/src/unit/Ship";

const TorpedoAttackTooltip: React.FC<{ target: Ship }> = ({ target }) => {
  return (
    <>
      <TooltipHeader>TARGET: {target.name}</TooltipHeader>
    </>
  );
};

export default TorpedoAttackTooltip;
