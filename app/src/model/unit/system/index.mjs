import * as thrusters from "./thruster";
import * as engines from "./engine";
import * as reactors from "./reactor";

const merged = {
  ...thrusters,
  ...engines,
  ...reactors
};

export default merged;
