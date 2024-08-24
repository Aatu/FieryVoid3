import * as Uc from "./uc/index";
import * as Test from "./test/index";
import * as Protectorate from "./protectorate/index";
import * as Federation from "./federation/index";
import Ship from "../Ship";

const merged: Record<string, typeof Ship> = {
  ...Uc,
  ...Protectorate,
  ...Test,
  ...Federation,
};
export default merged;
