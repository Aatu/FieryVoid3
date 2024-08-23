import * as React from "react";
import styled from "styled-components";
import { Pivot } from "../../../../styled/icon";
import Container from "./Container";
import { MovementService } from "@fieryvoid3/model/src/movement";
import Ship from "@fieryvoid3/model/src/unit/Ship";

type ButtonContainerProps = {
  pivotDirection: number;
};

const ButtonContainer = styled(Container)<ButtonContainerProps>`
  left: 125px;
  top: 103px;

  ${(props) =>
    props.pivotDirection === 1
      ? "left: -175px; transform: rotate(-90deg);"
      : "transform: rotate(-90deg) scaleY(-1);"}
`;

type Props = {
  ship: Ship;
  movementService: MovementService;
  pivotDirection: 1 | -1;
};

const DeploymentPivotButton: React.FC<Props> = ({
  ship,
  movementService,
  pivotDirection,
}) => {
  const pivot = () => {
    return movementService.doDeploymentTurn(ship, pivotDirection);
  };

  return (
    <ButtonContainer pivotDirection={pivotDirection} onClick={pivot}>
      <Pivot />
    </ButtonContainer>
  );
};

export default DeploymentPivotButton;
