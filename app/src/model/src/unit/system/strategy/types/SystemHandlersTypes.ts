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
}

export type SystemMessage = { value?: string; header?: string };
