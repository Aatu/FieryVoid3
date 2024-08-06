import OutputReduced2 from "./OutputReduced2";
import OutputReduced4 from "./OutputReduced4";
import OutputReduced6 from "./OutputReduced6";
import OutputReduced8 from "./OutputReduced8";
import OutputReduced from "./OutputReduced";
import LoadingTimeIncreased from "./LoadingTimeIncreased";
import ForcedOffline from "./ForcedOffline";
import ForcedOfflineOverheat from "./ForcedOfflineOverheat";
import ThrustChannelHeatIncreased from "./ThrustChannelHeatIncreased";
import Critical from "./Critical";

export type CriticalTableEntry = {
  severity: number;
  critical: Critical;
};

export {
  ThrustChannelHeatIncreased,
  ForcedOfflineOverheat,
  ForcedOffline,
  LoadingTimeIncreased,
  OutputReduced2,
  OutputReduced4,
  OutputReduced6,
  OutputReduced8,
  OutputReduced,
};
