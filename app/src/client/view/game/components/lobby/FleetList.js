import React, { Component } from "react";
import styled from "styled-components";

import {
  SubTitle,
  DarkContainer,
  Section,
  SectionRight,
  Button,
  Value
} from "../../../../styled";
import { PurchasedShip } from "./PurchasedShip";

const FleetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 440px;
  justify-content: space-around;
  margin-top: 16px;
`;

class FleetList extends Component {
  openShipWindow(ship) {
    return () => {
      const { uiState } = this.props;
      uiState.showShipTooltip(ship, true, true);
    };
  }

  render() {
    const { ships, onReady, bought, uiState } = this.props;

    return (
      <DarkContainer>
        <Section>
          <SubTitle>Current fleet for slot</SubTitle>
          <SectionRight>
            {!bought && ships.length > 0 && (
              <Button buttonStyle="button" onClick={onReady}>
                Ready
              </Button>
            )}
          </SectionRight>
        </Section>
        <FleetContainer>
          {ships.map((ship, i) => (
            <PurchasedShip
              key={`fleetlist-ship-${i}`}
              ship={ship}
              uiState={uiState}
            />
          ))}
        </FleetContainer>
      </DarkContainer>
    );
  }
}

export default FleetList;
