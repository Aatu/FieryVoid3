import {
  addToDirection,
  hexFacingToAngle
} from "../../../../../model/utils/math.mjs";

const shouldEaseIn = (
  startsAndEnds,
  startEndIndex,
  between,
  betweenIndex,
  move
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
  startsAndEnds,
  startEndIndex,
  between,
  betweenIndex,
  move
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
  startsAndEnds,
  startEndIndex,
  between,
  betweenIndex,
  move
) => {
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
    )
  };
};

const startsAndEndsToSteps = startsAndEnds => {
  return startsAndEnds.map(({ start, end, between }, startEndIndex) => {
    return {
      startFacing: hexFacingToAngle(start.facing),
      endFacing: hexFacingToAngle(end.facing),
      steps: between.map((move, i) => {
        return betweenMap(startsAndEnds, startEndIndex, between, i, move);
      })
    };
  });
};

const setStartFacings = path => {
  return path.map(({ startFacing, endFacing, steps }) => {
    return {
      startFacing,
      endFacing,
      steps: steps.map(step => {
        if (step === null) {
          return { facing: startFacing };
        }

        const newStep = {
          ...step,
          startFacing
        };

        startFacing = addToDirection(startFacing, step.pivot);
        return newStep;
      })
    };
  });
};

const movesToSteps = moves => {
  const startsAndEnds = [];
  let between = [];
  let start = null;

  moves.forEach(move => {
    if (move.isDeploy()) {
      start = move;
    } else if (move.isEnd() && !start) {
      start = move;
    } else if (move.isEnd()) {
      startsAndEnds.push({
        start: start,
        between: [...between],
        end: move
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
  constructor(moves) {
    this.moves = moves;
    this.path = movesToSteps(moves);
  }

  getFacing(turn, percentDone) {
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
      if (step.facing !== undefined) {
        return step.facing;
      }
      return addToDirection(step.startFacing, step.pivot * stepDone);
    }
  }
}

export default PivotPath;
