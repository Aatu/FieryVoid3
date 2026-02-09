export type DiceRollMinMax = {
    min: number;
    max: number;
};
export type DiceRollFormula = number | string | DiceRollMinMax;
export declare class DiceRoller {
    private diceRoller;
    constructor();
    roll(dice: string | number | DiceRollMinMax): number;
}
