import React, { MouseEventHandler, useRef, useState } from "react";
import styled from "styled-components";
import { IconAndLabel } from "../../../../../../styled";
import CargoTooltip from "./CargoTooltip";
import CargoEntity from "@fieryvoid3/model/src/unit/system/cargo/CargoEntity";

const Container = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
  ${(props) => props.onClick && "cursor: pointer;"}
`;

type Props = {
  cargo: CargoEntity;
  amount?: number;
  handleOnClick?: () => void;
  handleMouseOver?: () => void;
  handleMouseOut?: () => void;
  tooltipAdditionalContent?: React.ReactNode;
  text?: string;
  absoluteTooltip?: boolean;
};

const CargoItem: React.FC<Props> = ({
  cargo,
  amount,
  handleMouseOver = () => {},
  handleMouseOut = () => {},
  handleOnClick = () => {},
  tooltipAdditionalContent,
  text,
  absoluteTooltip = false,
  ...rest
}) => {
  const element = useRef<HTMLDivElement>(null);
  const [mouseOveredCargo, setMouseOveredCargo] = useState<HTMLElement | null>(
    null
  );

  const onCargoMouseOver: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setMouseOveredCargo(element.current);
    handleMouseOver();
  };

  const onCargoMouseOut: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setMouseOveredCargo(null);
    handleMouseOut();
  };

  return (
    <>
      {absoluteTooltip && mouseOveredCargo && (
        <CargoTooltip
          absoluteTooltip={absoluteTooltip}
          element={mouseOveredCargo}
          cargo={cargo}
          additionalContent={tooltipAdditionalContent}
        />
      )}
      <Container
        onClick={handleOnClick}
        onMouseOver={onCargoMouseOver}
        onMouseOut={onCargoMouseOut}
        {...rest}
      >
        {!absoluteTooltip && mouseOveredCargo && (
          <CargoTooltip
            absoluteTooltip={absoluteTooltip}
            element={mouseOveredCargo}
            cargo={cargo}
            additionalContent={tooltipAdditionalContent}
          />
        )}
        <IconAndLabel ref={element} background={cargo.getBackgroundImage()}>
          {text ? text : amount}
        </IconAndLabel>
      </Container>
    </>
  );
};

export default CargoItem;
