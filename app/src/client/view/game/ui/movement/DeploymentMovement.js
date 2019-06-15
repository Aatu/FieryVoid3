import * as React from "react";
import Movement from "./Movement";
import DeploymentPivotButton from "./DeploymentPivotButton";

class DeploymentMovementButtons extends React.PureComponent {
  render() {
    const { ship, movementService, ...rest } = this.props;

    return (
      <Movement
        ship={ship}
        movementService={movementService}
        ui={false}
        {...rest}
      >
        <DeploymentPivotButton
          ship={ship}
          movementService={movementService}
          pivotDirection={-1}
        />

        <DeploymentPivotButton
          ship={ship}
          movementService={movementService}
          pivotDirection={1}
        />
      </Movement>
    );
  }
}

export default DeploymentMovementButtons;
