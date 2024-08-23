import * as React from "react";
import Movement from "./Movement";
import DeploymentPivotButton from "./DeploymentPivotButton";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { MovementService } from "@fieryvoid3/model/src/movement";

type Props = {
  ship: Ship;
  movementService: MovementService;
};

const DeploymentMovementButtons: React.FC<Props> = ({
  ship,
  movementService,
}) => {
  return (
    <Movement>
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
};

export default DeploymentMovementButtons;
