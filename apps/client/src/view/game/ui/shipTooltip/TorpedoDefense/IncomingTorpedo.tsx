import React from "react";
import styled from "styled-components";
import CargoItem from "../../system/SystemStrategyUi/cargo/CargoItem";
import TorpedoDefenseTooltip from "./TorpedoDefenseTooltip";
import UIState from "../../UIState";
import TorpedoFlight from "@fieryvoid3/model/src/unit/TorpedoFlight";
import Ship from "@fieryvoid3/model/src/unit/Ship";

const TorpedoCargoItem = styled(CargoItem)`
  display: inline-flex;
`;

type Props = {
  uiState: UIState;
  torpedoFlight: TorpedoFlight;
  ship: Ship;
  shooter: Ship;
};

const IncomingTorpedo: React.FC<Props> = ({
  uiState,
  torpedoFlight,
  ship,
  shooter,
}) => {
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
      handleOnClick={() => {}}
      handleMouseOver={torpedoMouseOver}
      handleMouseOut={torpedoMouseOut}
      cargo={torpedoFlight.torpedo}
      text={``}
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
};

export default IncomingTorpedo;
