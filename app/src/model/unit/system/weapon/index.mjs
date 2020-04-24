import TestWeapon from "./TestWeapon.mjs";
import OverPoweredTestWeapon from "./OverPoweredTestWeapon.mjs";

import * as coilguns from "./coilgun/index.mjs";

import PDC30mm from "./pdc/PDC30mm.mjs";

import * as railguns from "./railgun/index.mjs";

import * as launchers from "./launcher/index.mjs";

import AutoCannon85mm from "./autocannon/AutoCannon85mm.mjs";

const merged = {
  TestWeapon,
  PDC30mm,
  ...coilguns,
  ...railguns,
  ...launchers,
  AutoCannon85mm,
  OverPoweredTestWeapon,
};

export default merged;
