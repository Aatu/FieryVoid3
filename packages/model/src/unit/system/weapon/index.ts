import TestWeapon from "./TestWeapon";
import OverPoweredTestWeapon from "./OverPoweredTestWeapon";

import * as coilguns from "./coilgun/index";

import PDC30mm from "./pdc/PDC30mm";

import * as railguns from "./railgun/index";

import * as launchers from "./launcher/index";

import AutoCannon85mm from "./autocannon/AutoCannon85mm";

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
