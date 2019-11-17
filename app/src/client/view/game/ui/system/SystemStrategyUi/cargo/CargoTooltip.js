import React from "react";
import { RelativeTooltip } from "../../../../../../styled";
import { InfoHeader } from "../../SystemInfo";
import styled from "styled-components";

const CargoTooltipContainer = styled(RelativeTooltip)`
  width: 200px;
`;

class CargoTooltip extends React.Component {
  render() {
    const { element, cargo } = this.props;

    console.log("element", element);

    return (
      <CargoTooltipContainer element={element}>
        <InfoHeader>{cargo.getDisplayName()}</InfoHeader>
      </CargoTooltipContainer>
    );
  }
}

export default CargoTooltip;
