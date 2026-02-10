import * as React from "react";
import styled from "styled-components";
import { Pivot } from "../../../../styled/icon";
import Container from "./Container";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { MovementService } from "@fieryvoid3/model/src/movement";
import { Clickable } from "../../../../styled";
import { ClickableProps } from "../../../../styled/Clickable";

type ButtonContainerProps = {
  $pivotDirection: number;
};

const ButtonContainer = styled(Container)<
  ButtonContainerProps & ClickableProps
>`
  left: 25px;
  top: -16px;

  ${(props) =>
    props.$pivotDirection === 1
      ? "left: -57px;"
      : "transform: rotate(-180deg) scaleY(-1);"};

  ${Clickable}
`;

type Props = {
  ship: Ship;
  movementService: MovementService;
  pivotDirection: 1 | -1;
};

const PivotButton: React.FC<Props> = ({
  ship,
  movementService,
  pivotDirection,
}) => {
  const canPivot = () => {
    return movementService.canPivot(ship, pivotDirection);
  };

  const pivot = () => {
    if (!movementService.canPivot(ship, pivotDirection)) {
      return;
    }

    return movementService.pivot(ship, pivotDirection);
  };

  const can = canPivot();

  return (
    <ButtonContainer
      $pivotDirection={pivotDirection}
      onClick={pivot}
      disabled={!can}
    >
      <Pivot />
    </ButtonContainer>
  );
};

export default PivotButton;
