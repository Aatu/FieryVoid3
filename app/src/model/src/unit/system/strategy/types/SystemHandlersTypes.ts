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
  getHitSystemSizeMultiplier = "getHitSystemSizeMultiplier",
  canFire = "canFire",
  applyDamageFromWeaponFire = "applyDamageFromWeaponFire",
  onWeaponFired = "onWeaponFired",
  getBackgroundImage = "getBackgroundImage",
  onSystemPowerLevelIncrease = "onSystemPowerLevelIncrease",
  onSystemPowerLevelDecrease = "onSystemPowerLevelDecrease",
  isBoostable = "isBoostable",
  canBoost = "canBoost",
  boost = "boost",
  deBoost = "deBoost",
  canDeBoost = "canDeBoost",
  getOutputForBoost = "getOutputForBoost",
  getPowerRequiredForBoost = "getPowerRequiredForBoost",
  getUsageVsOutputText = "getUsageVsOutputText",
  getTotalCargoSpace = "getTotalCargoSpace",
  getAvailableCargoSpace = "getAvailableCargoSpace",
  isLoaded = "isLoaded",
  hasSpaceFor = "hasSpaceFor",
  addCargo = "addCargo",
  removeCargo = "removeCargo",
  getCargoEntry = "getCargoEntry",
  loadAmmoInstant = "loadAmmoInstant",
  getBaseHitChance = "getBaseHitChance",
  getRangeModifier = "getRangeModifier",
  isOnRange = "isOnRange",
  getFireControl = "getFireControl",
  hasCargo = "hasCargo",
  getCargoByParentClass = "getCargoByParentClass",
  getPossibleCriticals = "getPossibleCriticals",
  getRadiatedHeat = "getRadiatedHeat",

  canIntercept = "canIntercept",
  getNumberOfIntercepts = "getNumberOfIntercepts",
  getInterceptChance = "getInterceptChance",
  addTimesIntercepted = "addTimesIntercepted",
  onIntercept = "onIntercept",

  isPositionOnArc = "isPositionOnArc",
  isOnArc = "isOnArc",

  getLoadedLaunchers = "getLoadedLaunchers",
  launchTorpedo = "launchTorpedo",

  getFireOrders = "getFireOrders",
  addFireOrder = "addFireOrder",
  removeFireOrders = "removeFireOrders",
  usesFireOrders = "usesFireOrders",
  hasFireOrder = "hasFireOrder",
  executeFireOrders = "executeFireOrders",
  getFireOrderResolutionPriority = "getFireOrderResolutionPriority",
  checkFireOrderHits = "checkFireOrderHits",

  getHitChance = "getHitChance",
  getLoadingTime = "getLoadingTime",

  loadAmmo = "loadAmmo",
  getAmmoInMagazine = "getAmmoInMagazine",
  setNewLoadingTarget = "setNewLoadingTarget",
  getLoadingTarget = "getLoadingTarget",
  setNewSelectedAmmo = "setNewSelectedAmmo",
  getTurnsLoaded = "getTurnsLoaded",
}

export type SystemMessage = {
  value?: string | number | SystemMessage[];
  header?: string;
  sort?: string;
  component?: string;
  props?: unknown;
};