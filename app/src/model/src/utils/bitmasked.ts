import { degreeToRadian, radianToDegree } from "./math";

const opacityMask = parseInt("00000000000000000000000011111111", 2);
const fadeInSpeedMask = parseInt("00000000000011111111111100000000", 2);
const fadeOutSpeedMask = parseInt("11111111111100000000000000000000", 2);

const first16ByteMask = parseInt("00000000000000000111111111111111", 2);
const second16ByteMask = parseInt("00111111111111111000000000000000", 2);

export const storeAngleAndChange = (angle: number, change: number): number => {
  if (change > 10 || change < -10) {
    throw new Error("change must be in the range -10 to 10");
  }

  if (angle > 360 || angle < -360) {
    throw new Error("angle must be in the range -360 to 360");
  }

  const finalAngle = 16383 + Math.round(degreeToRadian(angle) * 100);
  const finalChange = 16383 + Math.round(degreeToRadian(change) * 1000);

  return (finalAngle << 15) + finalChange;
};

export const retrieveAngleAndChange = (data: number) => {
  const change = radianToDegree(((data & first16ByteMask) - 16383) / 1000);
  const angle = radianToDegree(
    (((data & second16ByteMask) >> 15) - 16383) / 100
  );

  return { angle, change };
};

export const storeOpacityAndFade = (
  opacity: number,
  fadeInSpeed: number,
  fadeOutSpeed: number
) => {
  if (opacity > 1 || opacity < 0) {
    throw new Error("opacity must be in the range 0 to 1");
  }

  const finalOpacity = Math.round(255 * opacity);

  if (fadeInSpeed > 4095 || fadeInSpeed < 0) {
    throw new Error("fadeInSpeed must be in the range 0 to 4095");
  }

  if (fadeOutSpeed > 4095 || fadeOutSpeed < 0) {
    throw new Error("fadeOutSpeed must be in the range 0 to 4095");
  }

  return (
    (Math.round(fadeOutSpeed) << 20) +
    (Math.round(fadeInSpeed) << 8) +
    finalOpacity
  );
};

export const retrieveOpacityAndFade = (data: number) => {
  const opacity = (data & opacityMask) / 255;
  const fadeInSpeed = (data & fadeInSpeedMask) >> 8;
  const fadeOutSpeed = (data & fadeOutSpeedMask) >> 20;

  return { opacity, fadeInSpeed, fadeOutSpeed };
};
