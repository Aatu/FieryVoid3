import ShipSystemStrategy from "./ShipSystemStrategy";

export type System_GetMaxEvasion = (
  payload: unknown,
  previousResponse: number
) => number;

class AllowsEvasionSystemStrategy extends ShipSystemStrategy {
  private evasion: number;

  constructor(evasion: number) {
    super();

    this.evasion = evasion || 0;
  }

  public getMaxEvasion = (
    payload: unknown,
    previousResponse: number = 0
  ): number => {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.evasion;
  };
}

export default AllowsEvasionSystemStrategy;
