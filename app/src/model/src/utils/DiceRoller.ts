import {
  DiceRoll,
  DiceRoller as RpgDiceRoller,
} from "@dice-roller/rpg-dice-roller";

export class DiceRoller {
  private diceRoller: RpgDiceRoller;

  public constructor() {
    this.diceRoller = new RpgDiceRoller();
  }

  public roll(dice: string | number): number {
    const result = this.diceRoller.roll(dice.toString()) as DiceRoll;

    return result.total;
  }
}
