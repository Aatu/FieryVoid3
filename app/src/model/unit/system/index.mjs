import * as thrusters from "./thruster/index.mjs";
import * as engines from "./engine/index.mjs";
import * as reactors from "./reactor/index.mjs";
import * as structures from "./structure/index.mjs";
import * as ewArrays from "./electronicWarfare/index.mjs";
import * as weapons from "./weapon/index.mjs";

const merged = {
  ...thrusters,
  ...engines,
  ...reactors,
  ...structures,
  ...ewArrays,
  ...weapons
};

export default merged;
