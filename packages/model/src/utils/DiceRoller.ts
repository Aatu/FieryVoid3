import {
  DiceRoll,
  DiceRoller as RpgDiceRoller,
} from "@dice-roller/rpg-dice-roller";

export type DiceRollMinMax = {
  min: number;
  max: number;
};

export type DiceRollFormula = number | string | DiceRollMinMax;

export class DiceRoller {
  private diceRoller: RpgDiceRoller;

  public constructor() {
    this.diceRoller = new RpgDiceRoller();
  }

  public roll(dice: string | number | DiceRollMinMax): number {
    if (isDiceRollMinMax(dice)) {
      return (dice.max - dice.min) * Math.random() + dice.min;
    }

    if (typeof dice === "number") {
      return dice;
    }

    const result = ([] as DiceRoll[]).concat(this.diceRoller.roll(dice));

    return result.reduce((acc, roll) => acc + roll.total, 0);
  }
}

const isDiceRollMinMax = (value: unknown): value is DiceRollMinMax => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as DiceRollMinMax).min === "number" &&
    typeof (value as DiceRollMinMax).max === "number"
  );
};
