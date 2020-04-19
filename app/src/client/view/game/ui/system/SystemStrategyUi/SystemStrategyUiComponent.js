import React from "react";
import CargoList from "./cargo/CargoList";
import TorpedoLauncher from "./torpedo/TorpedoLauncher";
import Ammo from "./ammo/Ammo";
import RangePenalty from "./range/RangePenalty";
import SystemHeatBar from "../../HeatBar/SystemHeatBar";

const SystemStrategyUiComponent = ({ name, ...props }) => {
  switch (name) {
    case "RangePenalty":
      return <RangePenalty {...props} />;
    case "Ammo":
      return <Ammo {...props} />;
    case "CargoList":
      return <CargoList {...props} />;
    case "TorpedoLauncher":
      return <TorpedoLauncher {...props} />;
    case "SystemHeatBar":
      return <SystemHeatBar {...props} />;
  }
};

export default SystemStrategyUiComponent;
