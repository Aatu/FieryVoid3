import { SerializedShip } from "../unit/Ship";
import { SerializedGameData } from "./GameData";

export enum GAME_MESSAGE {
  TAKE_SLOT = "takeSlot",
  LEAVE_SLOT = "leaveSlot",
  BUY_SHIPS = "buyShips",
  COMMIT_TURN = "commitTurn",
  COMMIT_DEPLOYMENT = "commitDeployment",
  REQUEST_REPLAY = "requestReplay",
  REPLAY = "replay",
  GAMEDATA = "gameData",
  TURN_CHANGED = "turnChanged",
}

export interface GameMessage {
  type: GAME_MESSAGE;
  payload: unknown;
}

export interface TakeSlotMessage extends GameMessage {
  payload: string;
}

export interface LeaveSlotMessage extends GameMessage {
  payload: string;
}

export interface BuyShipsMessage extends GameMessage {
  payload: {
    slotId: string;
    ships: SerializedShip[];
  };
}

export interface GameDataMessage extends GameMessage {
  payload: SerializedGameData;
}

export interface TurnDataMessage extends GameMessage {
  type: GAME_MESSAGE.TURN_CHANGED;
  payload: SerializedGameData[];
}

export interface ReplayMessage extends GameMessage {
  type: GAME_MESSAGE.REPLAY;
  payload: SerializedGameData[];
}

export interface RequestReplayMessage extends GameMessage {
  payload: { start: number; end: number | null };
}
