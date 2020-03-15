import React, { useCallback, useState } from "react";
import styled from "styled-components";
import {
  SubTitle,
  DarkContainer,
  Section,
  SectionRight,
  Button,
  Value,
  InputAndLabel
} from "../../../../styled";

const Container = styled.div`
  border: 1px solid black;
  width: 200px;
  padding: 8px;
`;

export function PurchasedShip({ ship, uiState }) {
  const openShipWindow = useCallback(() => {
    uiState.showShipTooltip(ship, true, true);
  }, [uiState, ship]);

  const [error, setError] = useState("Ship must have a name");

  return (
    <Container>
      <Button buttonStyle="text" onClick={openShipWindow}>
        {ship.shipTypeName} <Value>{ship.pointCost}</Value> points
      </Button>
      <InputAndLabel
        error={error}
        label="Name"
        onChange={e => {
          ship.name = e.target.value;
          if (!ship.name) {
            setError("Ship must have a name");
          } else {
            setError(null);
          }
        }}
      />
    </Container>
  );
}
