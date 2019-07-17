import * as React from "react";
import styled from "styled-components";
import { Clickable } from "../../../../styled";
import { Cancel } from "../../../../styled/icon";

const Container = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  left: 125px;
  top: 53px;
  ${Clickable}
`;

class RevertButton extends React.Component {
  canRevert() {
    const { movementService, ship } = this.props;
    return movementService.canRevert(ship);
  }

  revert() {
    const { movementService, ship } = this.props;
    return movementService.revert(ship);
  }

  render() {
    if (!this.canRevert()) {
      return null;
    }

    return (
      <Container onClick={this.revert.bind(this)}>
        <Cancel />
      </Container>
    );
  }
}

export default RevertButton;
