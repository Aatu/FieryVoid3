import * as React from "react";
import styled from "styled-components";
import { Clickable } from "../../../../styled";
import { Evade } from "../../../../styled/icon";
import Container from "./Container";

const EvadeContainer = styled(Container)`
  position: absolute;
  width: 26px;
  height: 26px;
  left: -13px;
  top: 28px;
  ${Clickable}
`;

const RotatedContainer = styled(EvadeContainer)`
  transform: rotate(180deg);
  top: 79px;
`;

const Evasion = styled.div`
  color: white;
  font-family: arial;
  font-size: 24px;
  text-transform: uppercase;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 50px;
  height: 20px;
  left: -25px;
  top: 57px;
`;

class EvadeButton extends React.Component {
  canEvade(step) {
    const { movementService, ship } = this.props;
    return movementService.canEvade(ship, step);
  }

  evade(step) {
    const { movementService, ship } = this.props;
    if (!movementService.canEvade(ship, step)) {
      return;
    }

    return movementService.evade(ship, step);
  }

  render() {
    const { ship } = this.props;
    const canMore = this.canEvade(1);
    const canLess = this.canEvade(-1);
    return (
      <>
        <EvadeContainer
          key="evade-more"
          onClick={this.evade.bind(this, 1)}
          disabled={!canMore}
        >
          <Evade />
        </EvadeContainer>

        <Evasion>{ship.movement.getEvasion()}</Evasion>
        <RotatedContainer
          key="evade-less"
          onClick={this.evade.bind(this, -1)}
          disabled={!canLess}
        >
          <Evade />
        </RotatedContainer>
      </>
    );
  }
}

export default EvadeButton;
