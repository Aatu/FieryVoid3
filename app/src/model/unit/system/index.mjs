import * as thrusters from "./thruster";
import * as engines from "./engine";
import * as reactors from "./reactor";
import * as structures from "./structure";
import * as ewArrays from "./electronicWarfare";
import * as weapons from "./weapon";

const merged = {
  ...thrusters,
  ...engines,
  ...reactors,
  ...structures,
  ...ewArrays,
  ...weapons
};

export default merged;
