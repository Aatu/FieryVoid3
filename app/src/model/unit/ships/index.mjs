import * as Uc from "./uc";
import * as Test from "./test";
import * as Protectorate from "./protectorate";

const merged = { ...Uc, ...Protectorate, ...Test };
export default merged;
