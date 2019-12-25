import test from "ava";
import GameData from "../../model/game/GameData";
import CombatLogTorpedoLaunch from "../../model/combatLog/CombatLogTorpedoLaunch.mjs";

test("Combat log serializes and deserializes nicely", test => {
  const game = new GameData();
  game.combatLog.addEntry(new CombatLogTorpedoLaunch(1));

  const newGame = new GameData(game.serialize());

  test.deepEqual(newGame.combatLog.entries[0], new CombatLogTorpedoLaunch(1));
});

test("Combat log gets cleared on advance turn", test => {
  const game = new GameData();
  game.combatLog.addEntry(new CombatLogTorpedoLaunch(1));

  test.deepEqual(game.combatLog.entries[0], new CombatLogTorpedoLaunch(1));
  game.advanceTurn();
  test.deepEqual(game.combatLog.entries, []);
});
