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
    return movementService.roll(ship);
  }

  render() {
    return (
      <RollContainer onClick={this.roll.bind(this)} can={!!this.canRoll()}>
        <Roll />
      </RollContainer>
    );
  }
}

export default RollButton;
