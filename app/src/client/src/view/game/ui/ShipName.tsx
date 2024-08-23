import React from "react";
import styled from "styled-components";
import { colors } from "../../../styled";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { useUser } from "../../../state/userHooks";

type ShipNameContainerProps = {
  isMine: boolean;
};

const ShipNameContainer = styled.span<ShipNameContainerProps>`
  color: ${(props) => (props.isMine ? colors.lightBlue : colors.textDanger)};
`;

const ShipName: React.FC<{ ship: Ship }> = ({ ship }) => {
  const { data: currentUser } = useUser();

  const isMine = ship.player.isUsers(currentUser || null);

  return (
    <ShipNameContainer isMine={isMine}>
      {ship.name || "Unnamed ship"}
    </ShipNameContainer>
  );
};

export default ShipName;
