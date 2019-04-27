import * as thrusters from "./thruster";
import * as engines from "./engine";
import * as reactors from "./reactor";
import * as structures from "./structure";

const merged = {
  ...thrusters,
  ...engines,
  ...reactors,
  ...structures
};

export default merged;
