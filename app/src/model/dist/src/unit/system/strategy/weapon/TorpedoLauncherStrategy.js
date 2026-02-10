import { CargoEntry } from "../../../../cargo/CargoEntry";
import { GAME_PHASE } from "../../../../game/gamePhase";
import TorpedoFlight from "../../../TorpedoFlight";
import { createTorpedoInstance } from "../../weapon/ammunition";
import ShipSystemStrategy from "../ShipSystemStrategy";
export class TorpedoLauncherStrategy extends ShipSystemStrategy {
    torpedoClasses = [];
    launchers = [];
    shotsInMagazine;
    magazineSize;
    reloadingTime;
    turnsOffline = 0;
    constructor(torpedoClasses, numberOfLaunchers, launcherLoadingTime, magazineSize, reloadingTime) {
        super();
        this.torpedoClasses = torpedoClasses;
        this.shotsInMagazine = magazineSize;
        this.magazineSize = magazineSize;
        this.reloadingTime = reloadingTime;
        while (numberOfLaunchers--) {
            this.launchers.push(new TorpedoLauncher(launcherLoadingTime));
        }
    }
    getTorpedoLaunchOptions(payload) {
        const launchers = this.launchers.filter((l) => l.canLaunch());
        const distance = this.getShip().hexDistanceTo(payload.target);
        const torpedos = this.torpedoClasses
            .map((c) => createTorpedoInstance(c))
            .filter((torpedo) => torpedo.minRange >= distance && torpedo.maxRange <= distance);
        return {
            systemId: this.getSystem().id,
            numberOfReadyLaunchers: launchers.length,
            torpedosToLaunch: torpedos,
        };
    }
    setLaunchTarget({ target, torpedo, }) {
        const plannedLaunches = this.launchers.reduce((total, launcher) => total + (Boolean(launcher.getLaunchTarget()) ? 1 : 0), 1);
        if (this.shotsInMagazine < plannedLaunches) {
            throw new Error("Magazine empty");
        }
        if (!this.torpedoClasses.includes(torpedo.getCargoClassName())) {
            throw new Error("Trying to launch wrong type of torpedo");
        }
        const distance = this.getShip().hexDistanceTo(target);
        if (torpedo.minRange > distance || torpedo.maxRange < distance) {
            throw new Error("Torpedo not in range");
        }
        const freeLauncher = this.launchers.filter((l) => l.canLaunch())[0];
        if (!freeLauncher) {
            throw new Error("No free launcher");
        }
        if (!this.getShip().shipCargo.hasCargo(new CargoEntry(torpedo, 1))) {
            throw new Error("Trying to launch more torpedos that the magazine has");
        }
        freeLauncher.setLaunchTarget(target, torpedo);
    }
    launchTorpedos() {
        return this.launchers
            .map((launcher) => {
            const targetId = launcher.getLaunchTarget();
            const torpedo = launcher.getTorpedo();
            launcher.launchTorpedo();
            if (!targetId || !torpedo) {
                return null;
            }
            if (!this.getShip().shipCargo.hasCargo(new CargoEntry(torpedo, 1))) {
                return null;
            }
            if (this.shotsInMagazine === 0) {
                return null;
            }
            const result = new TorpedoFlight(torpedo, targetId, this.getShip().id, this.getSystem().id);
            this.shotsInMagazine--;
            this.getShip().shipCargo.removeCargo(new CargoEntry(torpedo, 1));
            return result;
        })
            .filter(Boolean);
    }
    advanceTurn() {
        if (this.getSystem().isDisabled()) {
            this.turnsOffline++;
        }
        else {
            this.turnsOffline = 0;
        }
        this.launchers.forEach((l) => l.advanceTurn());
        if (this.turnsOffline >= this.reloadingTime) {
            this.shotsInMagazine = this.magazineSize;
        }
    }
    serialize(payload, previousResponse = {}) {
        return {
            ...previousResponse,
            torpedoLauncherSystemStrategy: {
                launchers: this.launchers.map((l) => l.serialize()),
                shotsInMagazine: this.shotsInMagazine,
                turnsOffline: this.turnsOffline,
            },
        };
    }
    deserialize(data = {}) {
        data?.torpedoLauncherSystemStrategy?.launchers.forEach((launcherData, index) => this.launchers[index].deserialize(launcherData));
        this.shotsInMagazine =
            data?.torpedoLauncherSystemStrategy?.shotsInMagazine ?? this.magazineSize;
        this.turnsOffline = data?.torpedoLauncherSystemStrategy?.turnsOffline ?? 0;
    }
    getLaunchers() {
        return this.launchers;
    }
    receivePlayerData({ clientSystem, gameData, phase, }) {
        if (phase !== GAME_PHASE.GAME) {
            return;
        }
        if (!clientSystem) {
            return;
        }
        if (this.getSystem().isDisabled()) {
            return;
        }
        const clientStrategy = clientSystem.getStrategiesByInstance(TorpedoLauncherStrategy)[0];
        if (!clientStrategy) {
            return false;
        }
        clientStrategy.getLaunchers().forEach((launcher) => {
            const targetId = launcher.getLaunchTarget();
            const torpedo = launcher.getTorpedo();
            if (!targetId || !torpedo) {
                return;
            }
            const targetShip = gameData.ships.getShipById(targetId);
            if (!targetShip ||
                gameData.ships.isSameTeam(targetShip, this.getShip())) {
                return;
            }
            this.setLaunchTarget({
                target: targetShip,
                torpedo,
            });
        });
    }
}
class TorpedoLauncher {
    loadingTime = 3;
    turnsLoaded = 3;
    launchTarget = null;
    torpedoToLaunch = null;
    constructor(loadingTime) {
        this.loadingTime = loadingTime;
        this.turnsLoaded = loadingTime;
    }
    getLaunchTarget() {
        return this.launchTarget;
    }
    getTorpedo() {
        return this.torpedoToLaunch;
    }
    advanceTurn() {
        this.turnsLoaded++;
    }
    setLaunchTarget(target, torpedo) {
        this.launchTarget = target.id;
        this.torpedoToLaunch = torpedo;
    }
    launchTorpedo() {
        this.turnsLoaded = 0;
        this.launchTarget = null;
        this.torpedoToLaunch = null;
    }
    canLaunch() {
        return this.turnsLoaded >= this.loadingTime && !this.launchTarget;
    }
    serialize() {
        return {
            turnsLoaded: this.turnsLoaded,
            launchTarget: this.launchTarget,
            torpedoToLaunch: this.torpedoToLaunch?.getCargoClassName() || null,
        };
    }
    deserialize(data) {
        this.turnsLoaded = data?.turnsLoaded ?? this.turnsLoaded;
        this.launchTarget = data?.launchTarget || null;
        this.torpedoToLaunch = data?.torpedoToLaunch
            ? createTorpedoInstance(data.torpedoToLaunch)
            : null;
    }
}
