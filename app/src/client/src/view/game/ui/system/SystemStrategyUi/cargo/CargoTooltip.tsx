import React, { ReactNode } from "react";
import {
  TooltipHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  RelativeOrStaticTooltip,
} from "../../../../../../styled/index";
import styled from "styled-components";
import CargoEntity from "@fieryvoid3/model/src/unit/system/cargo/CargoEntity";
import {
  SystemMessage,
  SystemMessageValue,
} from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";

const CargoTooltipContainer = styled(RelativeOrStaticTooltip)`
  width: 200px;
`;

type Props = {
  element: HTMLElement;
  cargo: CargoEntity;
  additionalContent: ReactNode;
  absoluteTooltip?: boolean;
};

const CargoTooltip: React.FC<Props> = ({
  element,
  cargo,
  additionalContent,
  absoluteTooltip,
}) => {
  return (
    <CargoTooltipContainer
      relative={!absoluteTooltip}
      $isRight={absoluteTooltip}
      element={element}
    >
      <TooltipHeader>{cargo.getDisplayName()}</TooltipHeader>
      {cargo.getCargoInfo().map((entry, i) => (
        <Entry key={`cargoTooltipEntry-${entry.header}-${i}`} {...entry} />
      ))}
      {additionalContent}
    </CargoTooltipContainer>
  );
};

const Entry: React.FC<SystemMessage> = ({ header, value }) => {
  const getValue = (value: SystemMessageValue) => {
    if (typeof value === "string") {
      return value.replace(/<br>/gm, "\n");
    }

    if (typeof value === "number") {
      return value;
    }

    if (Array.isArray(value)) {
      return (
        <>
          {value.map((subValue, i) => (
            <Entry key={`cargoTooltipEntry-${header}-${i}`} {...subValue} />
          ))}
        </>
      );
    }
  };

  return (
    <TooltipEntry>
      {header && <TooltipValueHeader>{header}: </TooltipValueHeader>}
      {value && <TooltipValue>{getValue(value)}</TooltipValue>}
    </TooltipEntry>
  );
};

export default CargoTooltip;
