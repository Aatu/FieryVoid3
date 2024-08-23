import * as React from "react";
import styled from "styled-components";
import { Clickable } from "../../../../styled";
import { Cancel } from "../../../../styled/icon";
import { ClickableProps } from "../../../../styled/Clickable";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { MovementService } from "@fieryvoid3/model/src/movement";

const Container = styled.div<ClickableProps>`
  position: absolute;
  width: 32px;
  height: 32px;
  left: 125px;
  top: 53px;
  ${Clickable}
`;

type Props = {
  ship: Ship;
  movementService: MovementService;
};

const RevertButton: React.FC<Props> = ({ movementService, ship }) => {
  const canRevert = () => {
    return movementService.canRevert(ship);
  };

  const revert = () => {
    return movementService.revert(ship);
  };

  if (!canRevert()) {
    return null;
  }

  return (
    <Container onClick={revert}>
      <Cancel />
    </Container>
  );
};

export default RevertButton;
