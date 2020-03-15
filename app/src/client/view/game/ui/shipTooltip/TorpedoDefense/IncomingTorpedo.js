import React from "react";
import styled from "styled-components";
import CargoItem from "../../system/SystemStrategyUi/cargo/CargoItem";
import TorpedoDefenseTooltip from "./TorpedoDefenseTooltip";

const TorpedoCargoItem = styled(CargoItem)`
  display: inline-flex;
`;

export default function IncomingTorpedo({
  uiState,
  torpedoFlight,
  ship,
  shooter
}) {
  const torpedoMouseOut = () => {
    /*
    uiState.customEvent("torpedoMouseOut", {
      ship: launcher.system.shipSystems.ship,
      torpedo: launcher.loadedTorpedo,
      target
    });
    */
  };

  const torpedoMouseOver = () => {
    /*
    uiState.customEvent("torpedoMouseOver", {
      ship: launcher.system.shipSystems.ship,
      torpedo: launcher.loadedTorpedo,
      target
    });
    */
  };

  return (
    <TorpedoCargoItem
      ship={ship}
      handleOnClick={() => {}}
      handleMouseOver={torpedoMouseOver}
      handleMouseOut={torpedoMouseOut}
      cargo={torpedoFlight.torpedo}
      amount={null}
      text={``}
      absoluteTooltip="left"
      tooltipAdditionalContent={
        <TorpedoDefenseTooltip
          shooter={shooter}
          target={ship}
          torpedoFlight={torpedoFlight}
          uiState={uiState}
        />
      }
    />
  );
}
