import { expect, test } from "vitest";
import GameData from "@fieryvoid3/model/src/game/GameData";
import CombatLogTorpedoLaunch from "@fieryvoid3/model/src/combatLog/CombatLogTorpedoLaunch";

test("Combat log serializes and deserializes nicely", () => {
  const game = new GameData();
  game.combatLog.addEntry(new CombatLogTorpedoLaunch("1"));

  const newGame = new GameData(game.serialize());

  expect(newGame.combatLog.entries[0]).toEqual(new CombatLogTorpedoLaunch("1"));
});

test("Combat log gets cleared on advance turn", () => {
  const game = new GameData();
  game.combatLog.addEntry(new CombatLogTorpedoLaunch("1"));

  expect(game.combatLog.entries[0]).toEqual(new CombatLogTorpedoLaunch("1"));
  game.advanceTurn();
  expect(game.combatLog.entries).toEqual([]);
});
