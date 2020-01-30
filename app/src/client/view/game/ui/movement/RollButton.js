import * as React from "react";
import styled from "styled-components";
import { Clickable } from "../../../../styled";
import { Roll } from "../../../../styled/icon";
import Container from "./Container";

const RollContainer = styled(Container)`
  position: absolute;
  width: 32px;
  height: 32px;
  left: -16px;
  top: -65px;
  ${Clickable}
`;

class RollButton extends React.Component {
  canRoll() {
    const { movementService, ship } = this.props;
    return movementService.canRoll(ship);
  }

  roll() {
    const { movementService, ship } = this.props;
    if (!movementService.canRoll(ship)) {
      return;
    }

    return movementService.roll(ship);
  }

  render() {
    const { ship } = this.props;
    return (
      <RollContainer
        active={ship.movement.isRolling()}
        onClick={this.roll.bind(this)}
        disabled={!this.canRoll()}
      >
        <Roll />
      </RollContainer>
    );
  }
}

export default RollButton;
