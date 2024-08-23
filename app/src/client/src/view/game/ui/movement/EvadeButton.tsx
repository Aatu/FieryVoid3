import * as React from "react";
import styled from "styled-components";
import { Clickable } from "../../../../styled";
import { Evade } from "../../../../styled/icon";
import Container from "./Container";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { MovementService } from "@fieryvoid3/model/src/movement";

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

type Props = {
  ship: Ship;
  movementService: MovementService;
};

const EvadeButton: React.FC<Props> = ({ movementService, ship }) => {
  const canEvade = (step: 1 | -1) => {
    return movementService.canEvade(ship, step);
  };

  const evade = (step: 1 | -1) => {
    if (!movementService.canEvade(ship, step)) {
      return;
    }

    return movementService.evade(ship, step);
  };

  const canMore = canEvade(1);
  const canLess = canEvade(-1);
  return (
    <>
      <EvadeContainer
        key="evade-more"
        onClick={() => evade(1)}
        disabled={!canMore}
      >
        <Evade />
      </EvadeContainer>

      <Evasion>{ship.movement.getEvasion()}</Evasion>
      <RotatedContainer
        key="evade-less"
        onClick={() => evade(-1)}
        disabled={!canLess}
      >
        <Evade />
      </RotatedContainer>
    </>
  );
};

export default EvadeButton;
