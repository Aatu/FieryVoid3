import MovementOrder from "./MovementOrder";

class MovementValidator {
  constructor(ship, turn, startMove) {
    this.ship = ship;
    this.turn = turn;
    this.startMove = startMove;

    this.thrusterUse = [];
  }

  validate() {
    const movement = this.ship.movement.getPlayerAddedMovement();
    return (
      this.ensureMovesAreCorrectlyBuilt(this.startMove, movement) &&
      this.ensureMovesAreFullyPaid($movement)
    );
  }

  getNewEndMove() {
    const lastmove = this.ship.movement.getLastMove();
    const vector = this.ship.movement.getMovementVector();
    const rollMove = this.ship.movement.getRollMove();
    const rolled = rollMove ? !this.startMove.rolled : this.startMove.rolled;

    return new MovementOrder(
      null,
      "end",
      this.startMove.position.add(this.startMove.target).add(vector),
      this.startMove.target.add(vector),
      lastmove.facing,
      rolled,
      this.turn
    );
  }

     ensureMovesAreFullyPaid(movement)
    {
        const thrusters = this.ship.movement.getThrusters();
        let totalChanneled = 0;
        let cost = 0;

        movement.forEach(move => {
            const currentRequiredThrust = move.requiredThrust;
            const validRequiredThrust = new RequiredThrust(this.ship, move);
            
            $move->requiredThrust->setThrusters($thrusters);
            $move->requiredThrust->validateRequirementsAreCorrect($this->ship, $move);
            $move->requiredThrust->validatePaid();

            foreach ($thrusters as $thruster) {
                $used = $move->requiredThrust->getThrustChanneledBy($thruster);
                if ($used === 0) {
                    continue;
                }

                if (!isset($this->thrusterUse[$thruster->id])) {
                    $this->thrusterUse[$thruster->id] = ["amount" => $used, "thruster" => $thruster];
                } else {
                    $this->thrusterUse[$thruster->id]["amount"] += $used;
                }

                $totalChanneled += $used;
            }
        })

    

        foreach ($this->thrusterUse as $entry) {
            $amount = $entry["amount"];
            $thruster = $entry["thruster"];

            if (!$thruster->canChannelAmount($amount)) {
                throw new MovementValidationException("Thruster can not channel this much");
            }

            $cost += $thruster->getChannelCost($amount);
        }

        $enginePower = Movement::getThrustProduced($this->ship);

        if ($cost > $enginePower) {
            throw new MovementValidationException("Insufficient engine power");
        }

        return true;
    }
/*
    private function ensureMovesAreCorrectlyBuilt($start, $movement)
    {
        $lastMove = $start;
        $hasRoll = false;

        foreach ($movement as $index => $move) {
            if ($move->isRoll() && $index !== 0) {
                throw new MovementValidationException("Roll movement is allowed only as the first move of turn");
            } else if ($move->isRoll()) {
                $hasRoll = true;
            }

            if (($move->isEvade() && $hasRoll && $index !== 1) || ($move->isEvade() && !$hasRoll && $index !== 0)) {
                throw new MovementValidationException("Evade movement is allowed only in the beginnig of moves");
            }

            switch ($move->type) {
                case "speed":
                    $this->constructSpeed($lastMove, $move);
                    break;
                case "pivot";
                    $this->constructPivot($lastMove, $move);
                    break;
                case "evade";
                    $this->constructEvade($start, $move);
                    break;
                case "roll";
                    $this->constructRoll($start, $move);
                    break;
                default:
                    throw new MovementValidationException("Found unrecognized movement type '$move->type'");

            }

            $lastMove = $move;
        }

        return true;
    }

    private function constructSpeed($last, $move)
    {
        if ($move->value < 0 || $move->value > 5) {
            throw new MovementValidationException("Speed movement value is out of bounds");
        }

        $test = $last->clone();
        $test->target = (new OffsetCoordinate(0, 0))->moveToDirection($move->value);
        $test->type = "speed";
        $test->value = $move->value;
        $test->turn = $this->turn;

        Debug::log(json_encode($test));
        Debug::log(json_encode($move));

        if (!$test->equals($move)) {
            throw new MovementValidationException("Speed movement is constructed wrong");
        }
    }

    private function constructPivot($last, $move)
    {
        if ($move->value !== -1 && $move->value !== 1) {
            throw new MovementValidationException("Pivot movement value is out of bounds");
        }

        $test = $last->clone();
        $test->target = new OffsetCoordinate(0, 0);
        $test->type = "pivot";
        $test->facing = Mathlib::addToHexFacing($test->facing, $move->value);
        $test->value = $move->value;
        $test->turn = $this->turn;

    
        if (!$test->equals($move)) {
            throw new MovementValidationException("Pivot movement is constructed wrong");
        }
    }

    private function constructEvade($last, $move)
    {
        if ($move->value < 1 && $move->value > Movement::getMaxEvasion($this->ship)) {
            throw new MovementValidationException("Evade movement value is out of bounds");
        }

        $test = $last->clone();
        $test->target = new OffsetCoordinate(0, 0);
        $test->type = "evade";
        $test->value = $move->value;
        $test->turn = $this->turn;

        if (!$test->equals($move)) {
            throw new MovementValidationException("Evade movement is constructed wrong");
        }
    }

    private function constructRoll($last, $move)
    {
        if ($move->value !== 1 && $move->value !== 0) {
            throw new MovementValidationException("Roll movement value is out of bounds");
        }

        $test = $last->clone();
        $test->target = new OffsetCoordinate(0, 0);
        $test->type = "roll";
        $test->value = $last->rolled ? 0 : 1;
        $test->turn = $this->turn;

        if (!$test->equals($move)) {
            throw new MovementValidationException("Roll movement is constructed wrong");
        }
    }

    private function getNewMoves()
    {
        $result = [];

        foreach (array_reverse($this->ship->movement) as $move) {
            if ($move->turn === $this->turn && !$move->isDeploy()) {
                array_unshift($result, $move);
            }
        }

        return $result;
    }

    private function getRollMove()
    {
        foreach (array_reverse($this->ship->movement) as $move) {
            if ($move->turn === $this->turn && $move->isRoll()) {
                return $move;
            }
        }

        return null;
    }
*/
}

export default MovementValidator;
