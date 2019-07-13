import * as Uc from "./uc/index.mjs";
import * as Test from "./test/index.mjs";
import * as Protectorate from "./protectorate/index.mjs";

const merged = { ...Uc, ...Protectorate, ...Test };
export default merged;
