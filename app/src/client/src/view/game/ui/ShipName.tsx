import React from "react";
import styled from "styled-components";
import { colors } from "../../../styled";

type ShipNameContainerProps = {
  isMine: boolean;
};

const ShipNameContainer = styled.span<ShipNameContainerProps>`
  color: ${(props) => (props.isMine ? colors.lightBlue : colors.textDanger)};
`;

const ShipName: React.FC<{ shipName?: string | null; isMine: boolean }> = ({
  shipName,
  isMine,
}) => {
  return (
    <ShipNameContainer isMine={isMine}>
      {shipName || "Unnamed ship"}
    </ShipNameContainer>
  );
};

export default ShipName;
