import React from "react";
import styled from "styled-components";
import { X } from "../../../../styled/icon";
import Container from "./Container";
import { MovementService } from "@fieryvoid3/model/src/movement";
import Ship from "@fieryvoid3/model/src/unit/Ship";

const ButtonContainer = styled(Container)`
  left: -175px;
  top: 53px;
`;

type Props = {
  ship: Ship;
  movementService: MovementService;
};

const CancelButton: React.FC<Props> = ({ movementService, ship }) => {
  const canCancel = () => {
    return movementService.canCancel(ship);
  };

  const cancel = () => {
    return movementService.cancel(ship);
  };

  if (!canCancel()) {
    return null;
  }

  return (
    <ButtonContainer onClick={cancel}>
      <X />
    </ButtonContainer>
  );
};

export default CancelButton;
