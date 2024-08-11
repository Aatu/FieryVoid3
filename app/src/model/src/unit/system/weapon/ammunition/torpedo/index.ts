import Torpedo158MSV from "./Torpedo158MSV";
import Torpedo158MSV2 from "./Torpedo158MSV2";
import Torpedo158Nuclear from "./Torpedo158Nuclear";
import Torpedo72MSV from "./Torpedo72MSV";
import Torpedo72HE from "./Torpedo72HE";
import Torpedo158HE from "./Torpedo158HE";
import Torpedo from "./Torpedo";

export const torpedoes = {
  Torpedo158MSV2,
  Torpedo158MSV,
  Torpedo158Nuclear,
  Torpedo72MSV,
  Torpedo72HE,
  Torpedo158HE,
};

export type TropedoType = keyof typeof torpedoes;

export const createTorpedoInstance = (className: TropedoType): Torpedo => {
  //@ts-ignore
  return new torpedoes[className]();
};
