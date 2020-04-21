import * as thrusters from "./thruster/index.mjs";
import * as engines from "./engine/index.mjs";
import * as reactors from "./reactor/index.mjs";
import * as structures from "./structure/index.mjs";
import * as ewArrays from "./electronicWarfare/index.mjs";
import weapons from "./weapon/index.mjs";
import * as heat from "./heat/index.mjs";
import CargoBay from "./cargo/CargoBay.mjs";
import FuelTank from "./cargo/FuelTank.mjs";

const merged = {
  ...thrusters,
  ...engines,
  ...reactors,
  ...structures,
  ...ewArrays,
  ...weapons,
  ...heat,
  CargoBay,
  FuelTank,
};

export default merged;
