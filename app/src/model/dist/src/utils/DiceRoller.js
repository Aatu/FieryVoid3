import { DiceRoller as RpgDiceRoller, } from "@dice-roller/rpg-dice-roller";
export class DiceRoller {
    diceRoller;
    constructor() {
        this.diceRoller = new RpgDiceRoller();
    }
    roll(dice) {
        if (isDiceRollMinMax(dice)) {
            return (dice.max - dice.min) * Math.random() + dice.min;
        }
        if (typeof dice === "number") {
            return dice;
        }
        const result = [].concat(this.diceRoller.roll(dice));
        return result.reduce((acc, roll) => acc + roll.total, 0);
    }
}
const isDiceRollMinMax = (value) => {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.min === "number" &&
        typeof value.max === "number");
};
