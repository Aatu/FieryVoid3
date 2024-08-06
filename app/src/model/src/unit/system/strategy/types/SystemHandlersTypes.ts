import { System_GetMaxEvasion } from "../AllowsEvasionSystemStrategy";
import ShipSystemStrategy from "../ShipSystemStrategy";

export enum SYSTEM_HANDLERS {
  getMaxEvasion = "getMaxEvasion",
  canBeTargeted = "canBeTargeted",
  getMessages = "getMessages",
  serialize = "serialize",
  getArmorModifier = "getArmorModifier",
  onSystemOffline = "onSystemOffline",
  canSetOffline = "canSetOffline",
  canSetOnline = "canSetOnline",
  shouldBeOffline = "shouldBeOffline",
  onSystemOnline = "onSystemOnline",
  getPowerOutput = "getPowerOutput",
  getPowerRequirement = "getPowerRequirement",
  getHeatTransferPerStructure = "getHeatTransferPerStructure",
  getOverheatTransferRatio = "getOverheatTransferRatio",
  getHeatGenerated = "getHeatGenerated",
  generatesHeat = "generatesHeat",
  canStoreHeat = "canStoreHeat",
  getHeatStoreAmount = "getHeatStoreAmount",
  getHeatRadiationCapacity = "getHeatRadiationCapacity",
  radiateHeat = "radiateHeat",
  getSelectedAmmo = "getSelectedAmmo",
  isEwArray = "isEwArray",
  getEwEntries = "getEwEntries",
  resetEw = "resetEw",
  assignEw = "assignEw",
  canUseEw = "canUseEw",
  getBoost = "getBoost",
  getTotalEwUsedByType = "getTotalEwUsedByType",
  getIconText = "getIconText",
  isRadiator = "isRadiator",
  getValidEwTypes = "getValidEwTypes",
  deserialize = "deserialize",
  advanceTurn = "advanceTurn",
  getRequiredPhasesForReceivingPlayerData = "getRequiredPhasesForReceivingPlayerData",
  receivePlayerData = "receivePlayerData",
  censorForUser = "censorForUser",
  getHitProfile = "getHitProfile",
  resetBoost = "resetBoost",
  isDirection = "isDirection",
  getThrustDirection = "getThrustDirection",
  getThrustOutput = "getThrustOutput",
  getChanneledThrust = "getChanneledThrust",
  setChanneledThrust = "setChanneledThrust",
  getFuelRequirement = "getFuelRequirement",
  isThruster = "isThruster",
  resetChanneledThrust = "resetChanneledThrust",
  addChanneledThrust = "addChanneledThrust",
  getFuel = "getFuel",
  getFuelSpace = "getFuelSpace",
  takeFuel = "takeFuel",
  onGameStart = "onGameStart",
  loadTargetInstant = "loadTargetInstant",
  setMaxFuel = "setMaxFuel",
}

export type SystemMessage = {
  value?: string | SystemMessage[];
  header?: string;
  sort?: string;
  component?: string;
  props?: unknown;
};
