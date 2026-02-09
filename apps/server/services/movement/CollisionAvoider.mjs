import Offset from "../../../model/hexagon/Offset";
import { shuffleArray } from "../../../model/utils/math";

class CollisionAvoider {
  avoidCollisions(gameData) {
    let done = false;
    let i = 1;
    do {
      done = avoid(gameData.ships.getShips());
    } while (!done);
  }
}

const isOverlapping = (ship, ships) => {
  return ships.filter((otherShip) => {
    if (ship === otherShip) {
      return false;
    }

    if (ship.movement.isOverlapping(otherShip)) {
      return true;
    }

    return false;
  });
};

const isOverlappingSameSize = (ship, ships) => {
  const overlapping = isOverlapping(ship, ships);

  return overlapping.some(
    (otherShip) => otherShip.hexSizes.length >= ship.hexSizes.length
  );
};

const doForceMove = (ship, ships, careAboutSmall) => {
  const endMove = ship.movement.getLastMove();
  const initialPosition = endMove.getHexPosition();
  const velocity = endMove.getHexVelocity().normalize();

  if (tryPosition(ship, endMove, ships, careAboutSmall)) {
    return;
  }

  const facings = [0, 3]
    .concat(shuffleArray([1, 2, 4, 5]))
    .map((facing) => {
      let stepsRequired = 0;
      let found = false;
      let position = initialPosition.clone();

      while (!found) {
        stepsRequired++;
        position = position.add(velocity.rotate(facing));
        endMove.setPosition(position);
        found = tryPosition(ship, endMove, ships, careAboutSmall);
      }

      return {
        facing,
        stepsRequired,
        position,
      };
    })
    .sort((a, b) => {
      if (a.stepsRequired > b.stepsRequired) {
        return 1;
      }

      if (a.stepsRequired < b.stepsRequired) {
        return -1;
      }

      return 0;
    });

  endMove.setPosition(facings[0].position);
  ship.movement.replaceLastMove(endMove);
};

const tryPosition = (ship, move, ships, careAboutSmall) => {
  ship.movement.replaceLastMove(move);
  if (careAboutSmall) {
    return isOverlapping(ship, ships).length === 0;
  }
  return !isOverlappingSameSize(ship, ships);
};

const findColliding = (ships) => {
  const colliding = ships
    .filter((ship) => isOverlappingSameSize(ship, ships))
    .filter(
      (ship) =>
        !ship.movement.getLastMove().getHexVelocity().equals(new Offset(0, 0))
    );

  colliding.sort((a, b) => {
    const lastMoveA = a.movement.getLastMove();
    const lastMoveB = b.movement.getLastMove();

    if (a.hexSizes.length > b.hexSizes.length) {
      return -1;
    }
    if (a.hexSizes.length < b.hexSizes.length) {
      return 1;
    }

    if (lastMoveA.velocity.length() > lastMoveB.velocity.length()) {
      return -1;
    }

    if (lastMoveA.velocity.length() < lastMoveB.velocity.length()) {
      return 1;
    }

    return 0;
  });

  return colliding;
};

const avoid = (ships) => {
  let colliding = findColliding(ships);

  if (colliding.length === 0) {
    return true;
  }

  colliding.forEach((ship) => doForceMove(ship, ships, false));

  return false;
};

export default CollisionAvoider;
