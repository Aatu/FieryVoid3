import * as React from "react";
import styled from "styled-components";
import { Pivot } from "../../../../styled/icon";
import Container from "./Container";

const ButtonContainer = styled(Container)`
  left: 125px;
  top: 103px;

  ${props =>
    props.pivotDirection === 1
      ? "left: -175px; transform: rotate(-90deg);"
      : "transform: rotate(-90deg) scaleY(-1);"}
`;

class DeploymentPivotButton extends React.Component {
  pivot() {
    const { ship, movementService, pivotDirection } = this.props;
    return movementService.doDeploymentTurn(ship, pivotDirection);
  }

  render() {
    const { pivotDirection } = this.props;

    return (
      <ButtonContainer
        pivotDirection={pivotDirection}
        onClick={this.pivot.bind(this)}
      >
        <Pivot />
      </ButtonContainer>
    );
  }
}

export default DeploymentPivotButton;
