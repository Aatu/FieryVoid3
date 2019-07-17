import * as React from "react";
import styled from "styled-components";
import { Arrow } from "../../../../styled/icon";
import {
  getPointInDirection,
  hexFacingToAngle
} from "../../../../../model/utils/math";

import Container from "./Container";

const ButtonContainer = styled(Container)`

  ${props => `transform: rotate(${props.direction + 90}deg);`}

  ${props => `left: calc(${props.x}px - 16px);`}
  ${props => `top: calc(${props.y}px - 16px);`}
`;

class ThrustButton extends React.Component {
  getPosition(direction) {
    return getPointInDirection(75, -hexFacingToAngle(direction), 0, 0);
  }

  canThrust() {
    const { ship, movementService, direction } = this.props;
    return movementService.canThrust(ship, direction);
  }

  thrust(can) {
    if (!can) {
      return;
    }

    const { ship, movementService, direction } = this.props;
    return movementService.thrust(ship, direction);
  }

  render() {
    const { direction } = this.props;

    const can = this.canThrust();
    const { overChannel } = can;

    return (
      <ButtonContainer
        overChannel={overChannel}
        can={!!can}
        direction={hexFacingToAngle(direction)}
        onClick={this.thrust.bind(this, can)}
        {...this.getPosition(direction)}
      >
        <Arrow />
      </ButtonContainer>
    );
  }
}

export default ThrustButton;
