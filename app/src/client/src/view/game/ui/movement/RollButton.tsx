import * as React from "react";
import styled from "styled-components";
import { Clickable } from "../../../../styled";
import { Roll } from "../../../../styled/icon";
import Container from "./Container";
import { MovementService } from "@fieryvoid3/model/src/movement";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { ClickableProps } from "../../../../styled/Clickable";

const RollContainer = styled(Container)<ClickableProps>`
  position: absolute;
  width: 32px;
  height: 32px;
  left: -16px;
  top: -65px;
  ${Clickable}
`;

type Props = {
  ship: Ship;
  movementService: MovementService;
};

const RollButton: React.FC<Props> = ({ movementService, ship }) => {
  const canRoll = () => {
    return movementService.canRoll(ship);
  };

  const roll = () => {
    if (!movementService.canRoll(ship)) {
      return;
    }

    return movementService.roll(ship);
  };

  return (
    <RollContainer
      active={ship.movement.isRolling()}
      onClick={roll}
      disabled={!canRoll()}
    >
      <Roll />
    </RollContainer>
  );
};

export default RollButton;
