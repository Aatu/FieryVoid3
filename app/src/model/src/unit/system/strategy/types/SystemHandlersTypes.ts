export enum SYSTEM_HANDLERS {
  getMaxEvasion = "getMaxEvasion",
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
  setMaxFuel = "setMaxFuel",
  getHitSystemSizeMultiplier = "getHitSystemSizeMultiplier",
  canFire = "canFire",
  applyDamageFromWeaponFire = "applyDamageFromWeaponFire",
  onWeaponFired = "onWeaponFired",
  getBackgroundImage = "getBackgroundImage",
  onSystemPowerLevelIncrease = "onSystemPowerLevelIncrease",
  onSystemPowerLevelDecrease = "onSystemPowerLevelDecrease",

  getOutputForBoost = "getOutputForBoost",
  getPowerRequiredForBoost = "getPowerRequiredForBoost",
  getUsageVsOutputText = "getUsageVsOutputText",
  getTotalCargoSpace = "getTotalCargoSpace",
  getAvailableCargoSpace = "getAvailableCargoSpace",
  isLoaded = "isLoaded",
  hasSpaceFor = "hasSpaceFor",
  getBaseHitChance = "getBaseHitChance",
  getRangeModifier = "getRangeModifier",
  isOnRange = "isOnRange",
  getFireControl = "getFireControl",
  getPossibleCriticals = "getPossibleCriticals",
  getRadiatedHeat = "getRadiatedHeat",

  canIntercept = "canIntercept",
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
  setNewLoadingTarget = "setNewLoadingTarget",
  getLoadingTarget = "getLoadingTarget",
  setNewSelectedAmmo = "setNewSelectedAmmo",
  getTurnsLoaded = "getTurnsLoaded",
  addToLoading = "addToLoading",

  setFuel = "setFuel",

  changeMode = "changeMode",

  getWeaponFireAnimationName = "getWeaponFireAnimationName",
  getWeaponFireAnimationArguments = "getWeaponFireAnimationArguments",
  getTotalBurstSize = "getTotalBurstSize",
  getTooltipMenuButton = "getTooltipMenuButton",
  hasArcs = "hasArcs",
  getArcs = "getArcs",

  getMaxRange = "getMaxRange",
  getUiComponents = "getUiComponents",
}

export type SystemMessageValue = string | number | SystemMessage[];

export type SystemMessage = {
  value?: SystemMessageValue;
  header?: string;
  sort?: string;
  component?: string;
  props?: unknown;
};
