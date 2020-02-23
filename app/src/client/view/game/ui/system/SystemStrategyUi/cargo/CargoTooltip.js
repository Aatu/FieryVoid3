import React from "react";
import {
  RelativeTooltip,
  TooltipHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  RelativeOrStaticTooltip
} from "../../../../../../styled";
import styled from "styled-components";

const CargoTooltipContainer = styled(RelativeOrStaticTooltip)`
  width: 200px;
`;

class CargoTooltip extends React.Component {
  render() {
    const { element, cargo, additionalContent, absoluteTooltip } = this.props;

    return (
      <CargoTooltipContainer
        relative={!absoluteTooltip}
        right={absoluteTooltip === "right"}
        element={element}
      >
        <TooltipHeader>{cargo.getDisplayName()}</TooltipHeader>
        {cargo.getCargoInfo().map(getEntry)}
        {additionalContent}
      </CargoTooltipContainer>
    );
  }
}

const getEntry = ({ header, value }, i) => {
  if (value.replace) {
    value = value.replace(/<br>/gm, "\n");
  }

  return (
    <TooltipEntry key={`cargoTooltipEntry-${header}-${i}`}>
      {header && <TooltipValueHeader>{header}: </TooltipValueHeader>}
      {value && <TooltipValue>{value}</TooltipValue>}
    </TooltipEntry>
  );
};

export default CargoTooltip;
