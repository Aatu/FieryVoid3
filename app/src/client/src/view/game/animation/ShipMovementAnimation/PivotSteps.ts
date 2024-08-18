import { MovementOrder } from "@fieryvoid3/model/src/movement";
import {
  addToDirection,
  hexFacingToAngle,
} from "@fieryvoid3/model/src/utils/math";

type StartAndEnd = {
  start: MovementOrder;
  end: MovementOrder;
  between: MovementOrder[];
};

type Step = {
  startFacing: number;
  endFacing: number;
  steps: (BetweenMap | null)[];
};

type BetweenMap = {
  pivot: number;
  easeIn: boolean;
  easeOut: boolean;
};

const shouldEaseIn = (
  startsAndEnds: StartAndEnd[],
  startEndIndex: number,
  between: MovementOrder[],
  betweenIndex: number,
  move: MovementOrder
) => {
  if (!between[betweenIndex - 1]) {
    if (!startsAndEnds[startEndIndex - 1]) {
      return true;
    } else {
      const lastBetween = startsAndEnds[startEndIndex - 1].between;
      const lastMove = lastBetween[lastBetween.length - 1];
      if (!lastMove.isPivot() || lastMove.value !== move.value) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    const lastMove = between[betweenIndex - 1];
    if (!lastMove.isPivot() || lastMove.value !== move.value) {
      return true;
    } else {
      return false;
    }
  }
};

const shouldEaseOut = (
  startsAndEnds: StartAndEnd[],
  startEndIndex: number,
  between: MovementOrder[],
  betweenIndex: number,
  move: MovementOrder
) => {
  if (!between[betweenIndex + 1]) {
    if (!startsAndEnds[startEndIndex + 1]) {
      return true;
    } else {
      const nextBetween = startsAndEnds[startEndIndex + 1].between;
      const nextMove = nextBetween[0];
      if (!nextMove.isPivot() || nextMove.value !== move.value) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    const nextMove = between[betweenIndex + 1];
    if (!nextMove.isPivot() || nextMove.value !== move.value) {
      return true;
    } else {
      return false;
    }
  }
};

const betweenMap = (
  startsAndEnds: StartAndEnd[],
  startEndIndex: number,
  between: MovementOrder[],
  betweenIndex: number,
  move: MovementOrder
): BetweenMap | null => {
  if (!move.isPivot()) {
    return null;
  }

  return {
    pivot: move.value === 1 ? 60 : -60,
    easeIn: shouldEaseIn(
      startsAndEnds,
      startEndIndex,
      between,
      betweenIndex,
      move
    ),
    easeOut: shouldEaseOut(
      startsAndEnds,
      startEndIndex,
      between,
      betweenIndex,
      move
    ),
  };
};

const startsAndEndsToSteps = (startsAndEnds: StartAndEnd[]): Step[] => {
  return startsAndEnds.map(({ start, end, between }, startEndIndex) => {
    return {
      startFacing: hexFacingToAngle(start.facing),
      endFacing: hexFacingToAngle(end.facing),
      steps: between.map((move, i) => {
        return betweenMap(startsAndEnds, startEndIndex, between, i, move);
      }),
    };
  });
};

type PathStep = {
  startFacing: number;
  endFacing: number;
  steps: (BetweenMap | { facing: number })[];
};

const setStartFacings = (path: Step[]): PathStep[] => {
  return path.map(({ startFacing, endFacing, steps }) => {
    return {
      startFacing,
      endFacing,
      steps: steps.map((step) => {
        if (step === null) {
          return { facing: startFacing };
        }

        const newStep = {
          ...step,
          startFacing,
        };

        startFacing = addToDirection(startFacing, step.pivot);
        return newStep;
      }),
    };
  });
};

const movesToSteps = (moves: MovementOrder[]): PathStep[] => {
  const startsAndEnds: StartAndEnd[] = [];
  let between: MovementOrder[] = [];
  let start: null | MovementOrder = null;

  moves.forEach((move) => {
    if (move.isDeploy()) {
      start = move;
    } else if (move.isEnd() && !start) {
      start = move;
    } else if (move.isEnd()) {
      startsAndEnds.push({
        start: start!,
        between: [...between],
        end: move,
      });

      start = move;
      between = [];
    } else if (start && move.isPivot()) {
      between.push(move);
    } else if (start && move.isSpeed()) {
      between.push(move);
    }
  });

  return setStartFacings(startsAndEndsToSteps(startsAndEnds));
};

class PivotPath {
  public moves: MovementOrder[];
  public path: PathStep[];

  constructor(moves: MovementOrder[]) {
    this.moves = moves;
    this.path = movesToSteps(moves);
  }

  getFacing(turn: number, percentDone: number) {
    const steps = this.path[turn] || this.path[this.path.length - 1];
    const length = steps.steps.length;

    if (length === 0) {
      return steps.endFacing;
    } else {
      const stepIndex = this.path[turn]
        ? Math.floor(length * percentDone)
        : length - 1;
      const stepDone = this.path[turn] ? (length * percentDone) % 1 : 1;

      const step = steps.steps[stepIndex];
      if (isFacingStep(step)) {
        return step.facing;
      }

      //TODO: this whole file is nonesense
      return addToDirection(/*step.startFacing*/ 0, step.pivot * stepDone);
    }
  }
}

const isFacingStep = (
  step: { facing: number } | BetweenMap
): step is { facing: number } =>
  (step as { facing: number }).facing !== undefined;

export default PivotPath;
