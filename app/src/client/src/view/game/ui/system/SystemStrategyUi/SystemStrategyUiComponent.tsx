import React from "react";
import CargoList, { CargoListProps } from "./cargo/CargoList";
import TorpedoLauncher, {
  TorpedoLauncherProps,
} from "./torpedo/TorpedoLauncher";
import Ammo, { AmmoProps } from "./ammo/Ammo";
import RangePenalty, { RangePenaltyProps } from "./range/RangePenalty";
import SystemHeatBar, { SystemHeatBarProps } from "../../HeatBar/SystemHeatBar";
import SystemFuelBar, { SystemFuelBarProps } from "../../HeatBar/SystemFuelBar";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import Ship from "@fieryvoid3/model/src/unit/Ship";

type Props = {
  ship: Ship;
  system: ShipSystem;
  name: string;
  componentProps: unknown;
};

const SystemStrategyUiComponent: React.FC<Props> = ({
  name,
  ship,
  componentProps,
}) => {
  switch (name) {
    case "RangePenalty":
      return <RangePenalty {...(componentProps as RangePenaltyProps)} />;
    case "Ammo":
      return <Ammo {...(componentProps as AmmoProps)} ship={ship} />;
    case "CargoList":
      return <CargoList {...(componentProps as CargoListProps)} />;
    case "TorpedoLauncher":
      return (
        <TorpedoLauncher
          {...(componentProps as TorpedoLauncherProps)}
          ship={ship}
        />
      );
    case "SystemHeatBar":
      return <SystemHeatBar {...(componentProps as SystemHeatBarProps)} />;
    case "SystemFuelBar":
      return <SystemFuelBar {...(componentProps as SystemFuelBarProps)} />;
    default:
      throw Error(`SystemUiComponent "${name}" not found`);
  }
};

export default SystemStrategyUiComponent;