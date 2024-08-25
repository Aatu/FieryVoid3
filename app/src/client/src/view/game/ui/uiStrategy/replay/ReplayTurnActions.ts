import GameData from "@fieryvoid3/model/src/game/GameData";
import { MovementOrder } from "@fieryvoid3/model/src/movement";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import * as THREE from "three";
import AnimationUiStrategy from "../AnimationUiStrategy";
import ReplayContext from "../../../phase/phaseStrategy/AutomaticReplayPhaseStrategy/ReplayContext";
import { getSeededRandomGenerator } from "@fieryvoid3/model/src/utils/math";
import SystemDestroyedTextAnimation from "../../../animation/SystemDestroyedTextAnimation";
import CombatLogShipMovement from "@fieryvoid3/model/src/combatLog/CombatLogShipMovement";
import CombatLogGroupedWeaponFire from "@fieryvoid3/model/src/combatLog/CombatLogGroupedWeaponFire";
import CombatLogTorpedoLaunch from "@fieryvoid3/model/src/combatLog/CombatLogTorpedoLaunch";
import CombatLogGroupedTorpedoAttack from "@fieryvoid3/model/src/combatLog/CombatLogGroupedTorpedoAttack";
import CameraPositionAnimation from "../../../animation/CameraPositionAnimation";
import ShipDestroyedAnimation from "../../../animation/ShipDestroyedAnimation";
import SystemSection from "@fieryvoid3/model/src/unit/system/systemSection/SystemSection";
import ShipDamageAnimation from "../../../animation/ShipDamageAnimation";
import ShipObject from "../../../renderer/ships/ShipObject";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import TorpedoFlight from "@fieryvoid3/model/src/unit/TorpedoFlight";
import { TORPEDO_Z } from "@fieryvoid3/model/src/config/gameConfig";
import MSVTorpedoDamageStrategy from "@fieryvoid3/model/src/unit/system/weapon/ammunition/torpedo/torpedoDamageStrategy/MSVTorpedoDamageStrategy";
import TorpedoMovementAnimation from "../../../animation/TorpedoMovementAnimation";
import ExplosionEffect from "../../../animation/effect/ExplosionEffect";
import TorpedoExplosionMSV from "../../../animation/TorpedoExplosion/TorpedoExplosionMSV";
import TorpedoExplosionHE from "../../../animation/TorpedoExplosion/TorpedoExplosionHE";
import WeaponFireService from "@fieryvoid3/model/src/weapon/WeaponFireService";
import ShipWeaponAnimationService from "./ShipWeaponAnimationService";
import FireOrder from "@fieryvoid3/model/src/weapon/FireOrder";
import { SYSTEM_HANDLERS } from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";
import { ShipSystemAnimation, ShipWeaponAnimations } from "../../../animation";
import ShipMovementAnimation from "../../../animation/ShipMovementAnimation/ShipMovementAnimation";
import CombatLogTorpedoIntercept from "@fieryvoid3/model/src/combatLog/CombatLogTorpedoIntercept";

const getMovesForShip = (gameDatas: GameData[], ship: Ship) =>
  gameDatas.reduce((moves, gameData) => {
    return [
      ...moves,
      ...gameData.ships.getShipById(ship.id).movement.getMovement(),
    ];
  }, [] as MovementOrder[]);

const getEndMoveForShip = (gameDatas: GameData[], ship: Ship) =>
  getMovesForShip(gameDatas, ship).pop() as MovementOrder;

const getStartMoveForShip = (gameDatas: GameData[], ship: Ship) =>
  getMovesForShip(gameDatas, ship).shift() as MovementOrder;

const getShipStartPositionAndFacingForShip = (
  gameDatas: GameData[],
  ship: Ship
) => {
  const move = getStartMoveForShip(gameDatas, ship);

  return {
    position: move.position,
    facing: move.facing,
  };
};

class ReplayTurnActions extends AnimationUiStrategy {
  private replayContext: ReplayContext;
  private systemDestroyedTextAnimation: SystemDestroyedTextAnimation | null;
  private getRandom: () => number = Math.random;

  constructor(replayContext: ReplayContext) {
    super();
    this.replayContext = replayContext;

    this.systemDestroyedTextAnimation = null;
  }

  async newTurn({ gameDatas }: { gameDatas: GameData[] }) {
    const { shipIconContainer, particleEmitterContainer, uiState, scene } =
      this.getServices();

    await shipIconContainer.shipsLoaded();
    await particleEmitterContainer.getReady();

    const gameData = gameDatas[0];

    this.getRandom = getSeededRandomGenerator(
      "id" + gameData.id + "turn" + gameData.turn
    );

    uiState.startCombatLog(this.replayContext, gameData);

    this.systemDestroyedTextAnimation = new SystemDestroyedTextAnimation(scene);
    this.animations.push(this.systemDestroyedTextAnimation);

    gameData.combatLog.getForReplay().forEach((combatLogEntry) => {
      if (combatLogEntry instanceof CombatLogShipMovement) {
        this.buildMovementAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogGroupedWeaponFire) {
        this.buildWeaponFireAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogTorpedoLaunch) {
        this.buildTorpedoMoveAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogGroupedTorpedoAttack) {
        this.buildTorpedoAttackAnimation(combatLogEntry, gameDatas);
      }
    });

    this.buildShipDamageAnimations(gameDatas);
  }

  buildDestroyedShipsAnimation(gameDatas: GameData[], ship: Ship) {
    const { gameCamera, shipIconContainer, particleEmitterContainer, scene } =
      this.getServices();

    const start = this.replayContext.getDestroyedShipsStart();
    const cameraDuration = 2000;
    const effectStart = start + cameraDuration;

    const endMove = getEndMoveForShip(gameDatas, ship);
    const position = endMove.getPosition();
    const icon = shipIconContainer.getByShip(ship);

    this.animations.push(
      new CameraPositionAnimation(position, start, effectStart, gameCamera)
    );

    this.animations.push(
      new ShipDestroyedAnimation(
        icon,
        endMove.getFacing(),
        endMove.getPosition(),
        effectStart,
        this.getRandom,
        particleEmitterContainer,
        scene
      )
    );

    this.replayContext.addDestroyedShipsDuration(cameraDuration + 5000);
  }

  buildShipDamageAnimations(gameDatas: GameData[]) {
    const { shipIconContainer } = this.getServices();

    gameDatas[0].ships.getShips().forEach((ship) => {
      const icon = shipIconContainer.getByShip(ship);
      const systemsDestroyed =
        this.replayContext.getDestroyedStructuresByShip(ship);

      let end = null;

      if (ship.isDestroyedThisTurn()) {
        end = this.replayContext.getDestroyedShipsStart() + 2000;
        this.buildDestroyedShipsAnimation(gameDatas, ship);
      }

      let destroyedSections = ship.systems.sections
        .getSectionsWithStructure()
        .filter((section) => {
          const structure = section.getStructure();
          return (
            (!structure || structure.isDestroyed()) &&
            systemsDestroyed.every(({ systems }) =>
              systems.every(
                (system) => !structure || system.id !== structure.id
              )
            )
          );
        });

      const destroyedAnimations: {
        sections: SystemSection[];
        start: number;
        end: number | null;
      }[] = [];

      if (destroyedSections.length > 0) {
        destroyedAnimations.push({
          sections: destroyedSections,
          start: 0,
          end: null,
        });
      }

      systemsDestroyed.forEach(({ time, systems }) => {
        const newDestroyed = ship.systems.sections
          .getSectionsWithStructure()
          .filter((section) => {
            const structure = section.getStructure();
            return systems.some((system) => system.id === structure!.id);
          });

        time += this.getRandom() * 500 + 500;
        destroyedSections = [...destroyedSections, ...newDestroyed];

        if (destroyedAnimations[destroyedAnimations.length - 1]) {
          destroyedAnimations[destroyedAnimations.length - 1].end = time;
        }

        destroyedAnimations.push({
          sections: destroyedSections,
          start: time,
          end: end,
        });
      });

      destroyedAnimations.forEach(({ sections, start, end }) => {
        this.animations.push(
          new ShipDamageAnimation(icon, sections, start, end)
        );
      });
    });
  }

  buildInterceptAnimation(
    gameData: GameData,
    targetIcon: ShipObject,
    intercepts: CombatLogTorpedoIntercept[],
    interceptTime: number,
    interceptPosition: Vector,
    gameDatas: GameData[]
  ) {
    const { particleEmitterContainer, shipIconContainer } = this.getServices();

    const weaponAnimationService = new ShipWeaponAnimationService(
      this.getRandom,
      particleEmitterContainer
    );

    intercepts.forEach((intercept) => {
      const ship = gameData.ships.getShipById(intercept.shipId);
      const weapon = ship.systems.getSystemById(intercept.weaponId);

      if (!intercept.isSucessfull()) {
        return;
      }

      const animationName = weapon.callHandler(
        SYSTEM_HANDLERS.getWeaponFireAnimationName,
        undefined,
        "" as string
      );

      if (!animationName) {
        return;
      }

      // @ts-expect-error dynamic thingy
      const animation = new ShipWeaponAnimations[
        `ShipWeapon${
          animationName.charAt(0).toUpperCase() + animationName.slice(1)
        }Animation`
      ]({
        getRandom: this.getRandom,
        particleEmitterContainer: particleEmitterContainer,
        weapon,
        getPosition: (ship: Ship) =>
          getShipStartPositionAndFacingForShip(gameDatas, ship),
        args: weapon.callHandler(
          SYSTEM_HANDLERS.getWeaponFireAnimationArguments,
          undefined,
          undefined as unknown
        ),
        weaponAnimationService,
        targetIcon,
        shooterIcon: shipIconContainer.getByShip(ship),
        animationStartTime: 0,
        impactPosition: interceptPosition,
        impactTime: interceptTime,
        totalShots: weapon.callHandler(
          SYSTEM_HANDLERS.getTotalBurstSize,
          null,
          1
        ),
        shotsHit: intercept.isSucessfull() ? 1 : 0,
        omitHitExplosion: true,
      });

      this.animations.push(animation);
    });
  }

  buildTorpedoAttackAnimation(
    combatLogEntry: CombatLogGroupedTorpedoAttack,
    gameDatas: GameData[]
  ) {
    const {
      shipIconContainer,
      gameCamera,
      particleEmitterContainer,
      torpedoIconContainer,
      uiState,
    } = this.getServices();
    const gameData = gameDatas[0];

    const attackDuration = 3000;

    const start = this.replayContext.getNextTorpedoAttackStart();
    const cameraDuration = 2000;
    const fireStart = start + cameraDuration;

    const longestDuration = attackDuration;

    const target = gameData.ships.getShipById(combatLogEntry.targetId);
    const targetIcon = shipIconContainer.getByShip(target);

    const position = getStartMoveForShip(
      gameDatas,
      targetIcon.ship
    ).getPosition();

    this.animations.push(
      new CameraPositionAnimation(position, start, fireStart, gameCamera)
    );

    combatLogEntry.entries.forEach((torpedoEntry) => {
      const flight = gameData.torpedos.getTorpedoFlightById(
        torpedoEntry.torpedoFlightId
      ) as TorpedoFlight;

      uiState.addToCombatLog(torpedoEntry);

      const intercepts = gameData.combatLog.getInterceptsFor(torpedoEntry);

      const intercepted = intercepts.some((intercept) =>
        intercept.isSucessfull()
      );

      const interceptTime = intercepted
        ? fireStart + (attackDuration - 1000) + this.getRandom() * 1000
        : null;

      const targetPosition = new Vector(position)
        .setZ(targetIcon.shipZ)
        .add(
          new Vector(this.getRandom() * 30 - 15, this.getRandom() * 30 - 15, 0)
        );

      const attackDistance = 1000;
      const launchPosition = flight.launchPosition;
      const torpedoPosition = launchPosition
        .sub(targetPosition)
        .normalize()
        .multiplyScalar(attackDistance)
        .add(targetPosition)
        .setZ(TORPEDO_Z);

      const msvDistance = this.getRandom() * 200 + 300;
      const msvPosition =
        (flight.torpedo.getDamageStrategy() as MSVTorpedoDamageStrategy).msv &&
        !intercepted
          ? launchPosition
              .sub(targetPosition)
              .normalize()
              .multiplyScalar(msvDistance)
              .add(targetPosition)
              .setZ(TORPEDO_Z)
          : null;

      const flightDuration = msvPosition
        ? attackDuration * ((attackDistance - msvDistance) / attackDistance)
        : attackDuration;

      const randomFlightDuration = this.getRandom() * 500;
      const endTime = fireStart + attackDuration + randomFlightDuration;
      const flightEndTime = fireStart + flightDuration + randomFlightDuration;

      const speed = attackDistance / attackDuration;

      const animation = new TorpedoMovementAnimation(
        torpedoIconContainer.getIconByTorpedoFlight(flight),
        torpedoPosition,
        msvPosition ? msvPosition : targetPosition,
        fireStart,
        flightEndTime,
        false,
        interceptTime,
        true
      );

      const systemsDestroyed = torpedoEntry.getDestroyedSystems(target);

      if (systemsDestroyed.length > 0) {
        this.systemDestroyedTextAnimation!.add(
          new Vector(targetPosition.x, targetPosition.y, targetPosition.z),
          systemsDestroyed
            .map((system) => system.getDisplayName())
            .filter(Boolean) as string[],
          endTime
        );
      }

      const velocity = targetPosition
        .sub(launchPosition)
        .normalize()
        .multiplyScalar(attackDistance / attackDuration)
        .multiplyScalar(0.5);

      const interceptPosition = animation.getInterceptPosition();

      this.animations.push(animation);

      this.buildInterceptAnimation(
        gameData,
        targetIcon,
        intercepts,
        interceptTime as number,
        interceptPosition as Vector,
        gameDatas
      );

      if (intercepted) {
        this.animations.push(
          new ExplosionEffect(
            particleEmitterContainer,
            this.getRandom,
            {
              position: interceptPosition!,
              time: interceptTime!,
              duration: 250 + this.getRandom() * 250,
              type: "glow",
              size: this.getRandom() * 5 + 5,
              color: new THREE.Color(1.0, 0.9, 0.8),
              velocity,
            },
            this
          )
        );
      } else {
        switch (flight.torpedo.visuals.explosionType) {
          case "MSV":
            this.animations.push(
              new TorpedoExplosionMSV(
                flightEndTime,
                endTime,
                particleEmitterContainer,
                this.getRandom,
                flight.torpedo,
                torpedoEntry.damages,
                targetIcon,
                (ship) => getShipStartPositionAndFacingForShip(gameDatas, ship),
                msvPosition!,
                speed
              )
            );
            break;
          case "HE":
          default:
            this.animations.push(
              new TorpedoExplosionHE(
                (ship) => getShipStartPositionAndFacingForShip(gameDatas, ship),
                endTime,
                particleEmitterContainer,
                this.getRandom,
                flight.torpedo,
                targetIcon
              )
            );
            break;
        }
      }
    });

    this.replayContext.addTorpedoAttackAnimationDuration(
      cameraDuration + longestDuration + 1000
    );
  }

  buildTorpedoMoveAnimation(
    combatLogEntry: CombatLogTorpedoLaunch,
    gameDatas: GameData[]
  ) {
    const { torpedoIconContainer } = this.getServices();

    const duration = 5000;
    const start = this.replayContext.getMovementStart();
    this.replayContext.setMovementDuration(duration);

    const flight = gameDatas[0].torpedos.getTorpedoFlightById(
      combatLogEntry.torpedoFlightId
    ) as TorpedoFlight;

    const startTime = start + this.getRandom() * 2000;
    const endTime = start + duration + this.getRandom() * 1000;
    const animation = new TorpedoMovementAnimation(
      torpedoIconContainer.getIconByTorpedoFlight(flight),
      flight.launchPosition.setZ(TORPEDO_Z),
      flight.strikePosition.setZ(TORPEDO_Z),
      startTime,
      endTime,
      true
    );

    this.animations.push(animation);
  }

  buildWeaponFireAnimation(
    combatLogEntry: CombatLogGroupedWeaponFire,
    gameDatas: GameData[]
  ) {
    const { shipIconContainer, gameCamera, particleEmitterContainer, uiState } =
      this.getServices();
    const gameData = gameDatas[0];

    const weaponFireService = new WeaponFireService().update(gameData);
    const weaponAnimationService = new ShipWeaponAnimationService(
      this.getRandom,
      particleEmitterContainer
    );

    const start = this.replayContext.getNextFireStart();
    const cameraDuration = 2000;
    const fireStart = start + cameraDuration;

    let longestDuration = 0;

    const target = gameData.ships.getShipById(combatLogEntry.targetId);
    const targetIcon = shipIconContainer.getByShip(target);

    const position = getStartMoveForShip(gameDatas, target).getPosition();

    this.animations.push(
      new CameraPositionAnimation(position, start, fireStart, gameCamera)
    );

    combatLogEntry.entries.forEach((fireEntry) => {
      const fireOrder = weaponFireService.getFireOrderById(
        fireEntry.fireOrderId
      ) as FireOrder;

      uiState.addToCombatLog(fireEntry);

      const shooter = gameData.ships.getShipById(fireOrder.shooterId);
      const weapon = shooter.systems.getSystemById(fireOrder.weaponId);

      const animationName = weapon.callHandler(
        SYSTEM_HANDLERS.getWeaponFireAnimationName,
        undefined,
        null as string | null
      );

      if (!animationName) {
        return;
      }

      // @ts-expect-error dynamic thingy
      const animation = new ShipWeaponAnimations[
        `ShipWeapon${
          animationName.charAt(0).toUpperCase() + animationName.slice(1)
        }Animation`
      ]({
        getRandom: this.getRandom,
        particleEmitterContainer: particleEmitterContainer,
        weapon,
        getPosition: (ship: Ship) =>
          getShipStartPositionAndFacingForShip(gameDatas, ship),
        args: weapon.callHandler(
          SYSTEM_HANDLERS.getWeaponFireAnimationArguments,
          undefined,
          undefined as unknown
        ),
        weaponAnimationService,
        targetIcon,
        shooterIcon: shipIconContainer.getByShip(shooter),
        animationStartTime: fireStart,
        totalShots: fireEntry.totalShots,
        shotsHit: fireEntry.shotsHit,
        fireEntry,
      });

      this.animations.push(animation);
      const duration = animation.getDuration();

      if (duration > longestDuration) {
        longestDuration = duration;
      }

      const systemsDestroyed = fireEntry.getDestroyedSystems(target);

      if (systemsDestroyed.length > 0) {
        const systemDestroyedTime = fireStart + duration - 1000;
        this.replayContext.noteDestroyedSystem(
          target,
          systemDestroyedTime,
          systemsDestroyed
        );
        this.getSystemDestroyedTextAnimation().add(
          new Vector(position.x, position.y, position.z + targetIcon.shipZ),
          systemsDestroyed
            .map((system) => system.getDisplayName())
            .filter(Boolean) as string[],
          systemDestroyedTime
        );
      }
    });

    this.replayContext.addFireAnimationDuration(
      cameraDuration + longestDuration
    );
  }

  getSystemDestroyedTextAnimation() {
    if (!this.systemDestroyedTextAnimation) {
      throw new Error("SystemDestroyedTextAnimation not initialized");
    }

    return this.systemDestroyedTextAnimation;
  }

  buildMovementAnimation(
    combatLogEntry: CombatLogShipMovement,
    gameDatas: GameData[]
  ) {
    const { shipIconContainer } = this.getServices();

    const duration = 5000;
    const start = this.replayContext.getMovementStart();

    const ship = gameDatas[0].ships.getShipById(combatLogEntry.shipId);
    const icon = shipIconContainer.getById(combatLogEntry.shipId);

    icon.show();

    const animation = new ShipMovementAnimation(
      icon,
      ship,
      getMovesForShip(gameDatas, ship),
      start,
      start + duration
    );

    if (animation.doesMove()) {
      this.replayContext.setMovementDuration(duration);
    }

    this.animations.push(animation);

    this.animations.push(new ShipSystemAnimation(icon));
  }

  deactivate() {
    const { shipIconContainer, uiState, particleEmitterContainer } =
      this.getServices();
    shipIconContainer.getArray().forEach(function (icon) {
      icon.hide();
    }, this);

    uiState.hideCombatLog();

    particleEmitterContainer.release(this);
    this.animations.forEach((animation) => animation.deactivate());

    return super.deactivate();
  }
}

export default ReplayTurnActions;
