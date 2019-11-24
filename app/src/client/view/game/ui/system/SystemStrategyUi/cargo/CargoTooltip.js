import React from "react";
import { RelativeTooltip, TooltipHeader } from "../../../../../../styled";
import styled from "styled-components";

const CargoTooltipContainer = styled(RelativeTooltip)`
  width: 200px;
`;

class CargoTooltip extends React.Component {
  render() {
    const { element, cargo } = this.props;

    return (
      <CargoTooltipContainer element={element}>
        <TooltipHeader>{cargo.getDisplayName()}</TooltipHeader>
      </CargoTooltipContainer>
    );
  }
}

export default CargoTooltip;
