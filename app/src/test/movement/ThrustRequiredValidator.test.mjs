import test from "ava";
import MovementService from "../../model/movement/MovementService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import RequiredThrust from "../../model/movement/RequiredThrust";
import RequiredThrustValidator from "../../server/services/validation/RequiredThrustValidator.mjs";
import hexagon from "../../model/hexagon";
import Ship from "../../model/unit/Ship.mjs";

import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import ManeuveringThruster from "../../model/unit/system/thruster/ManeuveringThruster.mjs";

const startMove = new MovementOrder(
  -1,
  movementTypes.START,
  new hexagon.Offset(-32, 5),
  new hexagon.Offset(3, 2),
  0,
  false,
  999
);

const deployMove = new MovementOrder(
  -1,
  movementTypes.DEPLOY,
  new hexagon.Offset(0, 0),
  startMove.target,
  startMove.facing,
  startMove.rolled,
  999
);

const getMovementService = () =>
  new MovementService().update(
    { turn: 999 },
    { onShipMovementChanged: () => null }
  );

const constructShip = (id = 123) => {
  let ship = new Ship({
    id,
    accelcost: 3,
    rollcost: 3,
    pivotcost: 3,
    evasioncost: 3
  });
  ship.systems.addPrimarySystem([
    new Thruster({ id: 1, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 2, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 5, [1, 2]),
    new Thruster({ id: 9, hitpoints: 10, armor: 3 }, 5, [4, 5]),
    new Thruster({ id: 3, hitpoints: 10, armor: 3 }, 5, 3),
    new Thruster({ id: 4, hitpoints: 10, armor: 3 }, 5, 3),
    new ManeuveringThruster({ id: 10, hitpoints: 10, armor: 3 }, 6, 3),
    new Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20)
  ]);

  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = id => {
  const ship = constructShip(id);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (test, moves1, moves2) => {
  test.deepEqual(
    moves1.map(move => move.clone().setRequiredThrust(null)),
    moves2.map(move => move.clone().setRequiredThrust(null))
  );
};

test("Required thrust validates stuff", test => {
  const ship = constructDeployedShip();
  ship.accelcost = 10;
  const move = new MovementOrder(
    1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(4);

  let requiredThrust = new RequiredThrust(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(3, 5, thruster2);

  const validator = new RequiredThrustValidator(ship, move);
  test.true(validator.validateRequirementsAreCorrect(requiredThrust));
  test.is(validator.getThrustChanneledBy(thruster1, requiredThrust), 5);
  test.is(validator.getThrustChanneledBy(thruster2, requiredThrust), 5);
  test.true(validator.isPaid(requiredThrust));
  test.true(validator.ensureThrustersAreValid(requiredThrust));
});

test("Detect insufficient fulfilment", test => {
  const ship = constructDeployedShip();
  ship.accelcost = 10;
  const move = new MovementOrder(
    1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(4);

  let requiredThrust = new RequiredThrust(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(3, 4, thruster2);

  const validator = new RequiredThrustValidator(ship, move);
  test.true(validator.validateRequirementsAreCorrect(requiredThrust));
  test.is(validator.getThrustChanneledBy(thruster1, requiredThrust), 5);
  test.is(validator.getThrustChanneledBy(thruster2, requiredThrust), 4);
  const error = test.throws(() => validator.isPaid(requiredThrust));
  test.is(error.message, "Unpaid thrust: 1 for direction 3");
});

/*

<?php

require_once '../TestBase.php';

class RequiredThrustTest extends TestBase
{


    public function testMovementValidationMoveNotPaid()
    {
        $this->expectException(MovementValidationException::class);

        $required = new RequiredThrust([
            'fullfilments' => [3 => [["thrusterId" => 1, "amount" => 2], ["thrusterId" => 2, "amount" => 1]]],
            'requirements' => [3 => 4],
        ]);

        $thruster1 = new Thruster(3, 8, 0, 2, 3);
        $thruster1->id = 1;

        $thruster2 = new Thruster(3, 8, 0, 2, 3);
        $thruster2->id = 2;

        $thrusters = [
            $thruster1, $thruster2,
        ];

        $move = new MovementOrder(1, "speed", new OffsetCoordinate(0, 0), new OffsetCoordinate(1, 0), 0, false, 1, 0);

        $ship = new BaseShip(1, 1, "testship", 1);
        $ship->accelcost = 4;

        $required->setThrusters($thrusters);
        $this->assertTrue($required->validateRequirementsAreCorrect($ship, $move));
        $this->assertEquals($required->getThrustChanneledBy($thruster1), 2);
        $this->assertEquals($required->getThrustChanneledBy($thruster2), 1);
        $this->assertFalse($required->validatePaid());
    }


    public function testMovementValidationNonExistantThruster()
    {
        $this->expectException(MovementValidationException::class);

        $required = new RequiredThrust([
            'fullfilments' => [3 => [["thrusterId" => 1, "amount" => 2], ["thrusterId" => 3, "amount" => 2]]],
            'requirements' => [3 => 4],
        ]);

        $thruster1 = new Thruster(3, 8, 0, 2, 3);
        $thruster1->id = 1;

        $thruster2 = new Thruster(3, 8, 0, 2, 3);
        $thruster2->id = 2;

        $thrusters = [
            $thruster1, $thruster2,
        ];

        $move = new MovementOrder(1, "speed", new OffsetCoordinate(0, 0), new OffsetCoordinate(1, 0), 0, false, 1, 0);

        $ship = new BaseShip(1, 1, "testship", 1);
        $ship->accelcost = 4;

        $required->setThrusters($thrusters);
        $this->assertTrue($required->validateRequirementsAreCorrect($ship, $move));
        $this->assertEquals($required->getThrustChanneledBy($thruster1), 2);
        $this->assertEquals($required->getThrustChanneledBy($thruster2), 1);
        $this->assertFalse($required->validatePaid());
    }

    public function testMovementValidationThrusterDestroyed()
    {
        $this->expectException(MovementValidationException::class);

        $required = new RequiredThrust([
            'fullfilments' => [3 => [["thrusterId" => 1, "amount" => 2], ["thrusterId" => 2, "amount" => 2]]],
            'requirements' => [3 => 4],
        ]);

        $thruster1 = new Thruster(3, 8, 0, 2, 3);
        $thruster1->id = 1;
        $thruster1->damage[] = new DamageEntry(1, 1, 1, 1, 1, 999999, 1, 0, 1, true, '');

        $thruster2 = new Thruster(3, 8, 0, 2, 3);
        $thruster2->id = 2;

        $thrusters = [
            $thruster1, $thruster2,
        ];

        $move = new MovementOrder(1, "speed", new OffsetCoordinate(0, 0), new OffsetCoordinate(1, 0), 0, false, 1, 0);

        $ship = new BaseShip(1, 1, "testship", 1);
        $ship->accelcost = 4;

        $required->setThrusters($thrusters);
    }


    public function testMovementValidationMoveRequirementIsWrong()
    {
        $this->expectException(MovementValidationException::class);

        $required = new RequiredThrust([
            'fullfilments' => [3 => [["thrusterId" => 1, "amount" => 2], ["thrusterId" => 2, "amount" => 2]]],
            'requirements' => [3 => 2],
        ]);

        $move = new MovementOrder(1, "speed", new OffsetCoordinate(0, 0), new OffsetCoordinate(1, 0), 0, false, 1, 0);

        $ship = new BaseShip(1, 1, "testship", 1);
        $ship->accelcost = 4;

        $this->assertTrue($required->validateRequirementsAreCorrect($ship, $move));
    }

 
    public function testMovementValidationMoveRequirementIsWrong2()
    {
        $this->expectException(MovementValidationException::class);

        $required = new RequiredThrust([
            'fullfilments' => [3 => [["thrusterId" => 1, "amount" => 2], ["thrusterId" => 2, "amount" => 2]]],
            'requirements' => [6 => 4],
        ]);

        $move = new MovementOrder(1, "speed", new OffsetCoordinate(0, 0), new OffsetCoordinate(1, 0), 0, false, 1, 0);

        $ship = new BaseShip(1, 1, "testship", 1);
        $ship->accelcost = 4;

        $this->assertTrue($required->validateRequirementsAreCorrect($ship, $move));
    }


    public function testMovementValidationTryingToPayWithWrongThruster()
    {
        $this->expectException(MovementValidationException::class);

        $required = new RequiredThrust([
            'fullfilments' => [3 => [["thrusterId" => 1, "amount" => 2], ["thrusterId" => 2, "amount" => 2]]],
            'requirements' => [3 => 4],
        ]);

        $thruster1 = new Thruster(3, 8, 0, 2, 3);
        $thruster1->id = 1;

        $thruster2 = new Thruster(3, 8, 0, 2, [1, 2]);
        $thruster2->id = 2;

        $thrusters = [
            $thruster1, $thruster2,
        ];

        $move = new MovementOrder(1, "speed", new OffsetCoordinate(0, 0), new OffsetCoordinate(1, 0), 0, false, 1, 0);

        $ship = new BaseShip(1, 1, "testship", 1);
        $ship->accelcost = 4;

        $required->setThrusters($thrusters);
    }

}

*/
