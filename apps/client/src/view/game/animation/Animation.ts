import GameData from "@fieryvoid3/model/src/game/GameData";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import { RenderPayload } from "../phase/phaseStrategy/PhaseStrategy";

export interface IDuration {
  duration: number;
}

abstract class Animation implements IDuration {
  public active: boolean;
  public started: boolean;
  public done: boolean;
  public getRandom: () => number;
  public startCallback?: () => void;
  public doneCallback?: () => void;
  public time: number = 0;
  public duration: number = 0;

  constructor(getRandom?: () => number) {
    this.getRandom = getRandom || Math.random;
    this.active = false;
    this.started = false;
    this.done = false;
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  setIsDone(done: boolean) {
    this.done = done;
    return this;
  }

  setStartCallback(callback: () => void) {
    this.startCallback = callback;
    return this;
  }

  setDoneCallback(callback: () => void) {
    this.doneCallback = callback;
    return this;
  }

  callStartCallback(total: number) {
    if (!this.started && total > this.time) {
      if (this.startCallback) this.startCallback();

      this.started = true;
    }
  }

  callDoneCallback(total: number) {
    if (total > this.time + this.duration && !this.done) {
      if (this.doneCallback) this.doneCallback();

      this.done = true;
    }
  }

  getDuration() {
    return 0;
  }

  deactivate() {}

  reset() {}

  cleanUp() {}

  abstract update(gameData: GameData): void;

  abstract render(payload: RenderPayload): void;

  getRandomPosition(distance: number) {
    return new Vector(
      this.getRandom() * distance - distance * 0.5,
      this.getRandom() * distance - distance * 0.5,
      this.getRandom() * distance - distance * 0.5
    );
  }
}

export default Animation;
