import {
  storeOpacityAndFade,
  retrieveOpacityAndFade,
  storeAngleAndChange,
  retrieveAngleAndChange,
} from "../../../model/src/utils/bitmasked";

import { expect, test } from "vitest";
import { degreeToRadian } from "../../../model/src/utils/math";

test("opacity and fade values are saved propely", () => {
  const data = storeOpacityAndFade(0.5, 100, 200);

  const { opacity, fadeInSpeed, fadeOutSpeed } = retrieveOpacityAndFade(data);

  expect(opacity).toEqual(0.5019607843137255);
  expect(fadeInSpeed).toEqual(100);
  expect(fadeOutSpeed).toEqual(200);
});

test("opacity out of bounds will throw an error", () => {
  expect(async () => storeOpacityAndFade(2, 100, 200)).rejects.toThrow(
    "opacity must be in the range 0 to 1"
  );

  expect(async () => storeOpacityAndFade(-1, 100, 200)).rejects.toThrow(
    "opacity must be in the range 0 to 1"
  );
});

test("fade values out of bounds will throw an error", () => {
  expect(async () => storeOpacityAndFade(1, 41242412, 200)).rejects.toThrow(
    "fadeInSpeed must be in the range 0 to 4095"
  );

  expect(async () => storeOpacityAndFade(1, -123, 200)).rejects.toThrow(
    "fadeInSpeed must be in the range 0 to 4095"
  );

  expect(async () => storeOpacityAndFade(1, 0, 2412421412)).rejects.toThrow(
    "fadeOutSpeed must be in the range 0 to 4095"
  );

  expect(async () => storeOpacityAndFade(1, 2047, -2123)).rejects.toThrow(
    "fadeOutSpeed must be in the range 0 to 4095"
  );
});

test("angle and angle change values are stored properly", () => {
  const data = storeAngleAndChange(45.2, 0.5);

  const { angle, change } = retrieveAngleAndChange(data);

  expect(angle).toEqual(45.26366581533504);
  expect(change).toEqual(0.5156620156177408);
});
