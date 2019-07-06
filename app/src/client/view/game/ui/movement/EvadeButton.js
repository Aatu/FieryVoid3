import * as React from "react";
import styled from "styled-components";
import { Clickable } from "../../../../styled";
import { Evade } from "../../../../styled/icon";

const Container = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  left: -20px;
  top: 63px;
  ${Clickable}
`;

const RotatedContainer = styled(Container)`
  transform: rotate(180deg);
  top: 113px;
`;

class EvadeButton extends React.Component {
  canEvade(step) {
    const { movementService, ship } = this.props;
    return movementService.canEvade(ship, step);
  }

  evade(step) {
    const { movementService, ship } = this.props;
    return movementService.evade(ship, step);
  }

  render() {
    const canMore = this.canEvade(1);
    const canLess = this.canEvade(-1);
    return (
      <>
        <Container
          key="evade-more"
          onClick={this.evade.bind(this, 1)}
          can={!!canMore}
        >
          <Evade />
        </Container>
        <RotatedContainer
          key="evade-less"
          onClick={this.evade.bind(this, -1)}
          can={!!canLess}
        >
          <Evade />
        </RotatedContainer>
      </>
    );
  }
}

export default EvadeButton;
