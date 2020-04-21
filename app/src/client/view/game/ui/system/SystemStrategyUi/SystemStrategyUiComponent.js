import React from "react";
import CargoList from "./cargo/CargoList";
import TorpedoLauncher from "./torpedo/TorpedoLauncher";
import Ammo from "./ammo/Ammo";
import RangePenalty from "./range/RangePenalty";
import SystemHeatBar from "../../HeatBar/SystemHeatBar";
import SystemFuelBar from "../../HeatBar/SystemFuelBar";

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
    case "SystemFuelBar":
      return <SystemFuelBar {...props} />;
    default:
      throw Error(`SystemUiComponent "${name}" not found`);
  }
};

export default SystemStrategyUiComponent;
