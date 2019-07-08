import * as thrusters from "./thruster";
import * as engines from "./engine";
import * as reactors from "./reactor";
import * as structures from "./structure";
import * as ewArrays from "./electronicWarfare";

const merged = {
  ...thrusters,
  ...engines,
  ...reactors,
  ...structures,
  ...ewArrays
};

export default merged;
