import { v4 as uuidv4 } from "uuid";
import GameDataRepository from "../repository/GameDataRepository";
import GameData from "../../model/src/game/GameData";

type ResolveResult = { key: string | null; gameData: GameData };
type ReservedResolveResult = { key: string; gameData: GameData };

type Resolve = (value: ResolveResult) => void;
type ReservedResolve = (value: ReservedResolveResult) => void;

type Reservation = {
  resolve: Resolve | ReservedResolve;
  reject: (reason: any) => void;
  lock: boolean;
};

export type GameDataPromise = Promise<ResolveResult>;
export type ReservedGameDataPromise = Promise<ReservedResolveResult>;

class CachedGameData {
  private id: number;
  private gameDataRepository: GameDataRepository;
  private gameData: GameData | null;
  private reservations: Reservation[];
  private key: string | null;
  public lastRequested: number;

  constructor(id: number, gameDataRepository: GameDataRepository) {
    this.id = id;
    this.gameDataRepository = gameDataRepository;
    this.gameData = null;
    this.reservations = [];
    this.key = uuidv4();
    this.lastRequested = Date.now();
    this.init();
  }

  async init() {
    try {
      this.gameData = await this.gameDataRepository.loadGame(this.id);
    } catch (e) {
      this.rejectAll(e);
      throw e;
    }

    this.key = null;
    this.processReservations();
  }

  destroy() {
    this.rejectAll(new Error("This cache is dying"));
  }

  rejectAll(e: unknown) {
    this.reservations.forEach(({ resolve, reject }) => {
      reject(e);
    });

    this.reservations = [];
    this.key = null;
  }

  async release(key: string, gameDatas: GameData[]) {
    if (key !== this.key) {
      throw new Error("Wrong key for gamedata update");
    }

    gameDatas = ([] as GameData[]).concat(gameDatas);

    if (gameDatas.length === 0) {
      throw new Error("No gamedata to save");
    }

    try {
      await this.gameDataRepository.saveGame(gameDatas);
    } catch (e) {
      this.rejectAll(e);
      throw e;
    }

    this.gameData = gameDatas[gameDatas.length - 1]?.clone();

    this.key = null;
    this.processReservations();
  }

  async cancel(key: string) {
    if (key !== this.key) {
      throw new Error(
        `Wrong key for gamedata update key: '${key}', this.key: '${this.key}'`
      );
    }

    this.key = null;
    this.processReservations();
  }

  get(): GameDataPromise {
    this.lastRequested = Date.now();
    const promise = new Promise<ResolveResult>((resolve, reject) => {
      this.reservations.push({ resolve, reject, lock: false });
    });
    this.processReservations();
    return promise;
  }

  reserve(): ReservedGameDataPromise {
    this.lastRequested = Date.now();
    const promise = new Promise<ReservedResolveResult>((resolve, reject) => {
      this.reservations.push({ resolve, reject, lock: true });
    });
    this.processReservations();
    return promise;
  }

  processReservations() {
    if (this.reservations.length === 0 || !this.gameData) {
      return;
    }

    //process non locking reservations
    this.reservations = this.reservations.filter(
      ({ resolve, reject, lock }) => {
        if (!lock) {
          (resolve as Resolve)({ key: null, gameData: this.gameData!.clone() });
          return false;
        }
        return true;
      }
    );

    if (this.reservations.length === 0 || this.key) {
      return;
    }

    //lock and resolve
    const { resolve, reject, lock } = this.reservations.shift() as Reservation;
    let key = null;

    if (lock) {
      key = uuidv4();
      this.key = key;
    }

    (resolve as Resolve)({ key, gameData: this.gameData.clone() });
    this.processReservations();
  }
}

export default CachedGameData;
