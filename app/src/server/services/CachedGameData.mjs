import uuidv4 from "uuid/v4";

class CachedGameData {
  constructor(id, gameDataRepository) {
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

  rejectAll(e) {
    this.reservations.forEach(({ resolve, reject }) => {
      reject(e);
    });

    this.reservations = [];
    this.key = null;
  }

  async release(key, gameDatas) {
    if (key !== this.key) {
      throw new Error("Wrong key for gamedata update");
    }

    gameDatas = [].concat(gameDatas);

    try {
      await this.gameDataRepository.saveGame(gameDatas, true);
    } catch (e) {
      this.rejectAll(e);
      throw e;
    }

    this.gameData = gameDatas.pop().clone();

    this.key = null;
    this.processReservations();
  }

  get() {
    this.lastRequested = Date.now();
    const promise = new Promise((resolve, reject) => {
      this.reservations.push({ resolve, reject, lock: false });
    });
    this.processReservations();
    return promise;
  }

  reserve() {
    this.lastRequested = Date.now();
    const promise = new Promise((resolve, reject) => {
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
          resolve(this.gameData.clone());
          return false;
        }
        return true;
      }
    );

    if (this.reservations.length === 0 || this.key) {
      return;
    }

    //lock and resolve
    const { resolve, reject, lock } = this.reservations.shift();
    let key = null;

    if (lock) {
      key = uuidv4();
      this.key = key;
    }

    resolve({ key, gameData: this.gameData.clone() });
    this.processReservations();
  }
}

export default CachedGameData;
