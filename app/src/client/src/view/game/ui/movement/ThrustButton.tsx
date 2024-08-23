import * as React from "react";
import styled from "styled-components";
import { Arrow } from "../../../../styled/icon";

import Container from "./Container";
import {
  getPointInDirection,
  hexFacingToAngle,
} from "@fieryvoid3/model/src/utils/math";
import { MovementService } from "@fieryvoid3/model/src/movement";
import Ship from "@fieryvoid3/model/src/unit/Ship";

type ButtonContainerProps = {
  direction: number;
  x: number;
  y: number;
};

const ButtonContainer = styled(Container)<ButtonContainerProps>`
  ${(props) => `transform: rotate(${props.direction + 90}deg);`}

  ${(props) => `left: calc(${props.x}px - 16px);`}
  ${(props) => `top: calc(${props.y}px - 16px);`}
`;

const getPosition = (direction: number) => {
  return getPointInDirection(75, -hexFacingToAngle(direction), 0, 0);
};

type Props = {
  ship: Ship;
  movementService: MovementService;
  direction: number;
};

const ThrustButton: React.FC<Props> = ({
  ship,
  movementService,
  direction,
}) => {
  const thrust = (can: boolean) => {
    if (!can) {
      return;
    }

    return movementService.thrust(ship, direction);
  };

  const can = movementService.canThrust(ship, direction);

  return (
    <ButtonContainer
      disabled={!can}
      direction={hexFacingToAngle(direction)}
      onClick={() => thrust(can)}
      {...getPosition(direction)}
    >
      <Arrow />
    </ButtonContainer>
  );
};

export default ThrustButton;
