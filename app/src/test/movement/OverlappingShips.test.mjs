import test from "ava";
import Ship from "../../model/unit/Ship.mjs";
import Offset from "../../model/hexagon/Offset.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import movementTypes from "../../model/movement/MovementTypes.mjs";
import MovementHandler from "../../server/handler/MovementHandler.mjs";

/*
const nothingCollides = ships =>
  ships.every(ship => {
    const colliding = ships.every(otherShip => {
      if (ship === otherShip) {
        return true;
      }

      if (ship.movement.isOverlapping(otherShip)) {
        return false;
      }

      return true;
    });

    return colliding;
  });

test("Ships that are far away are not overlapping", test => {
  const ship = new Ship({ id: 1 });
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-30, 0),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const otherShip = new Ship({ id: 2 });
  otherShip.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  test.false(ship.movement.isOverlapping(otherShip));
});

test("Ships that are on top of each others, are not overlapping because they have no hex size", test => {
  const ship = new Ship({ id: 1 });
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const otherShip = new Ship({ id: 2 });
  otherShip.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  test.false(ship.movement.isOverlapping(otherShip));
});

test("Ships that are on top of each others and have hex sizes are overlapping", test => {
  const ship = new Ship({ id: 1 });
  ship.hexSizes = [new Offset(0, 0)];
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const otherShip = new Ship({ id: 2 });
  otherShip.hexSizes = [new Offset(0, 0)];
  otherShip.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  test.true(ship.movement.isOverlapping(otherShip));
});

test("Ships with large hex size are overlapping", test => {
  const ship = new Ship({ id: 1 });
  ship.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const otherShip = new Ship({ id: 2 });
  otherShip.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];
  otherShip.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(29, 1),
      new Offset(0, 0),
      1,
      0,
      1
    )
  );

  test.true(ship.movement.isOverlapping(otherShip));
});

test("Ships overlapping will be moved", test => {
  const ship = new Ship({ id: 1 });
  ship.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const otherShip = new Ship({ id: 2 });
  otherShip.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];
  otherShip.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(10, 0),
      1,
      0,
      1
    )
  );

  const gameData = {
    ships: {
      getShips: () => [ship, otherShip]
    }
  };

  const movementHandler = new MovementHandler();
  movementHandler.avoidCollisions(gameData);

  test.true(nothingCollides([ship, otherShip]));
});

test("A clusterfuck of ships colliding will be sorted out somehow", test => {
  let id = 0;
  const ships = [];

  const createShip = (position, velocity, facing = 0) => {
    id++;
    const ship = new Ship({ id });
    ship.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];
    ship.movement.addMovement(
      new MovementOrder(-1, movementTypes.END, position, velocity, facing, 0, 1)
    );

    ships.push(ship);
    return ship;
  };

  createShip(new Offset(0, 0), new Offset(0, 0), 1);
  createShip(new Offset(0, 0), new Offset(10, 0), 3);
  createShip(new Offset(0, 0), new Offset(-10, 0), 4);
  createShip(new Offset(1, 0), new Offset(1, 0), 5);
  createShip(new Offset(1, -1), new Offset(3, 0), 1);
  createShip(new Offset(-1, 0), new Offset(0, 4), 1);
  createShip(new Offset(0, 1), new Offset(0, 6), 2);
  createShip(new Offset(0, 1), new Offset(7, 2), 3);
  createShip(new Offset(1, 1), new Offset(1, 2), 5);

  const gameData = {
    ships: {
      getShips: () => ships
    }
  };

  const movementHandler = new MovementHandler();
  movementHandler.avoidCollisions(gameData);
  test.true(nothingCollides(ships));
});

test("Small ship will avoid large", test => {
  const ship = new Ship({ id: 1 });
  ship.hexSizes = [new Offset(0, 0)];
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(2, 0),
      0,
      0,
      1
    )
  );

  const otherShip = new Ship({ id: 2 });
  otherShip.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];
  otherShip.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(10, 0),
      0,
      0,
      1
    )
  );

  const ships = [ship, otherShip];
  const gameData = {
    ships: {
      getShips: () => [...ships]
    }
  };

  const movementHandler = new MovementHandler();
  movementHandler.avoidCollisions(gameData);

  test.true(nothingCollides(ships));
  test.deepEqual(otherShip.getHexPosition(), new Offset(30, 0));
});

test("Ships will avoid in correct order", test => {
  const ship = new Ship({ id: 1 });
  ship.hexSizes = [new Offset(0, 0)];
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(2, 0),
      0,
      0,
      1
    )
  );

  const otherShip = new Ship({ id: 2 });
  otherShip.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];
  otherShip.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(10, 0),
      0,
      0,
      1
    )
  );

  const otherShip2 = new Ship({ id: 3 });
  otherShip2.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];
  otherShip2.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(11, 0),
      0,
      0,
      1
    )
  );

  const ships = [otherShip, otherShip2, ship];

  const gameData = {
    ships: {
      getShips: () => [...ships]
    }
  };

  const movementHandler = new MovementHandler();
  movementHandler.avoidCollisions(gameData);

  test.true(nothingCollides(ships));
  test.deepEqual(otherShip.getHexPosition(), new Offset(30, 0));
});

test("Large ships that can not possibly avoid with only one move, will still manage to eventually avoid", test => {
  const ship = new Ship({ id: 1 });
  ship.hexSizes = [
    new Offset(0, 0),
    new Offset(-1, 0),
    new Offset(1, 0),
    new Offset(1, -1),
    new Offset(0, -1),
    new Offset(0, 1),
    new Offset(1, 1)
  ];

  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(10, 0),
      0,
      0,
      1
    )
  );

  const otherShip = new Ship({ id: 2 });
  otherShip.hexSizes = [
    new Offset(0, 0),
    new Offset(-1, 0),
    new Offset(1, 0),
    new Offset(1, -1),
    new Offset(0, -1),
    new Offset(0, 1),
    new Offset(1, 1)
  ];
  otherShip.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(30, 0),
      new Offset(10, 0),
      0,
      0,
      1
    )
  );

  const ships = [otherShip, ship];

  const gameData = {
    ships: {
      getShips: () => [...ships]
    }
  };

  const movementHandler = new MovementHandler();
  movementHandler.avoidCollisions(gameData);

  test.true(nothingCollides(ships));
  test.deepEqual(ship.getHexPosition(), new Offset(30, 0));
  test.deepEqual(otherShip.getHexPosition(), new Offset(33, 0));
});

test("A clusterfuck of large ships colliding will be sorted out somehow", test => {
  let id = 0;
  const ships = [];

  const createShip = (position, velocity, facing = 0) => {
    id++;
    const ship = new Ship({ id });
    ship.hexSizes = [
      new Offset(0, 0),
      new Offset(-1, 0),
      new Offset(1, 0),
      new Offset(1, -1),
      new Offset(0, -1),
      new Offset(0, 1),
      new Offset(1, 1)
    ];
    ship.movement.addMovement(
      new MovementOrder(-1, movementTypes.END, position, velocity, facing, 0, 1)
    );

    ships.push(ship);
    return ship;
  };

  createShip(new Offset(0, 0), new Offset(0, 0), 1);
  createShip(new Offset(0, 0), new Offset(10, 0), 3);
  createShip(new Offset(0, 0), new Offset(-10, 0), 4);
  createShip(new Offset(1, 0), new Offset(1, 0), 5);
  createShip(new Offset(1, -1), new Offset(3, 0), 1);
  createShip(new Offset(-1, 0), new Offset(0, 4), 1);
  createShip(new Offset(0, 1), new Offset(0, 6), 2);
  createShip(new Offset(0, 1), new Offset(7, 2), 3);
  createShip(new Offset(1, 1), new Offset(1, 2), 5);

  const gameData = {
    ships: {
      getShips: () => ships
    }
  };

  const movementHandler = new MovementHandler();
  movementHandler.avoidCollisions(gameData);
  test.true(nothingCollides(ships));
});

test("Ships avoiding collision scenario 1", test => {
  const ship = new Ship({ id: 1, name: "large 1, faster, should avoid" });
  ship.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(0, 0),
      new Offset(-5, 0),
      0,
      0,
      1
    )
  );

  const otherShip = new Ship({ id: 2, name: "large 2, shoud not avoid" });
  otherShip.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];
  otherShip.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(1, 0),
      new Offset(3, 0),
      1,
      0,
      1
    )
  );

  const otherShip2 = new Ship({ id: 3, name: "kirppu" });
  otherShip2.hexSizes = [new Offset(0, 0)];
  otherShip2.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(0, 0),
      new Offset(11, -4),
      0,
      0,
      1
    )
  );

  const otherShip3 = new Ship({ id: 4, name: "kirppu" });
  otherShip3.hexSizes = [new Offset(0, 0)];
  otherShip3.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(0, 0),
      new Offset(11, 5),
      0,
      0,
      1
    )
  );

  const ships = [otherShip, otherShip2, ship, otherShip3];

  const gameData = {
    ships: {
      getShips: () => [...ships]
    }
  };

  const movementHandler = new MovementHandler();
  movementHandler.avoidCollisions(gameData);

  test.true(nothingCollides(ships));
  test.deepEqual(otherShip.getHexPosition(), new Offset(1, 0));
  test.deepEqual(ship.getHexPosition(), new Offset(-1, 0));
});
*/
