import * as thrusters from "./thruster/index";
import * as engines from "./engine/index";
import * as reactors from "./reactor/index";
import * as structures from "./structure/index";
import * as ewArrays from "./electronicWarfare/index";
import weapons from "./weapon/index";
import * as heat from "./heat/index";
import CargoBay from "./cargo/CargoBay";
import FuelTank from "./cargo/FuelTank";

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
