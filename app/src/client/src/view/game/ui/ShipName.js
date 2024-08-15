import React, { useContext } from "react";
import { StateStore } from "../../../state/StoreProvider";
import styled from "styled-components";
import { colors } from "../../../styled";

const ShipNameContainer = styled.span`
  color: ${props => (props.isMine ? colors.lightBlue : colors.textDanger)};
`;

export default function ShipName({ ship }) {
  const { currentUser } = useContext(StateStore);

  const isMine = ship.player.isUsers(currentUser);

  return (
    <ShipNameContainer isMine={isMine}>
      {ship.name || "Unnamed ship"}
    </ShipNameContainer>
  );
}
