import * as React from "react";
import Movement from "./Movement";
import ThrustButton from "./ThrustButton";
import RevertButton from "./RevertButton";
import CancelButton from "./CancelButton";
import PivotButton from "./PivotButton";
import RollButton from "./RollButton";
import EvadeButton from "./EvadeButton";

class GameMovement extends React.PureComponent {
  render() {
    const { ship, movementService, ...rest } = this.props;

    return (
      <Movement ship={ship} movementService={movementService} {...rest}>
        <ThrustButton
          ship={ship}
          movementService={movementService}
          direction={0}
        />

        <ThrustButton
          ship={ship}
          movementService={movementService}
          direction={1}
        />

        <ThrustButton
          ship={ship}
          movementService={movementService}
          direction={2}
        />

        <ThrustButton
          ship={ship}
          movementService={movementService}
          direction={3}
        />

        <ThrustButton
          ship={ship}
          movementService={movementService}
          direction={4}
        />

        <ThrustButton
          ship={ship}
          movementService={movementService}
          direction={5}
        />

        <RevertButton ship={ship} movementService={movementService} />

        <CancelButton ship={ship} movementService={movementService} />

        <PivotButton
          ship={ship}
          movementService={movementService}
          pivotDirection={-1}
        />

        <PivotButton
          ship={ship}
          movementService={movementService}
          pivotDirection={1}
        />

        <RollButton ship={ship} movementService={movementService} />

        <EvadeButton ship={ship} movementService={movementService} />
      </Movement>
    );
  }
}

export default GameMovement;
