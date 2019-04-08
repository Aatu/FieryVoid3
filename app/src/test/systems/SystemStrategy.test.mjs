import test from "ava";
import ShipSystem from "../../model/unit/system/ShipSystem.mjs";
import ShipSystemStrategy from "../../model/unit/system/strategy/ShipSystemStrategy.mjs";

test("ShipSystem calls its strategies", test => {
  const testStrategy1 = new ShipSystemStrategy();
  testStrategy1.onTest = (system, payload, response = {}) => {
    const number = response.number || 0;
    const payloadNumber = payload.number || 0;
    return { ...response, number: payloadNumber + number + 1, strat1: true };
  };

  const testStrategy2 = new ShipSystemStrategy();
  testStrategy2.onTest = (system, payload, response = {}) => {
    const number = response.number || 0;
    return { ...response, number: number * 10, strat2: true };
  };

  const system = new ShipSystem();
  system.strategies = [testStrategy1, testStrategy2];
  const response = system.callHandler("onTest", { number: 1 });
  test.deepEqual(response, { number: 20, strat1: true, strat2: true });
});
