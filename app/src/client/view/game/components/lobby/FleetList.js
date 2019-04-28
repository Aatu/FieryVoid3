import React, { Component } from "react";

import {
  SubTitle,
  DarkContainer,
  Section,
  SectionRight,
  Button,
  Value
} from "../../../../styled";
class FleetList extends Component {
  openShipWindow(ship) {
    return () => {
      const { uiState } = this.props;
      uiState.openShipWindow(ship);
    };
  }

  render() {
    const { ships, onReady } = this.props;

    return (
      <DarkContainer>
        <Section>
          <SubTitle>Current fleet for slot</SubTitle>
          <SectionRight>
            {ships.length > 0 && (
              <Button buttonStyle="button" onClick={onReady}>
                Ready
              </Button>
            )}
          </SectionRight>
        </Section>
        {ships.map((ship, i) => (
          <Button
            key={`fleetlist-ship-${i}`}
            buttonStyle="text"
            onClick={this.openShipWindow(ship)}
          >
            {ship.shipTypeName} <Value>{ship.pointCost}</Value> points
          </Button>
        ))}
      </DarkContainer>
    );
  }
}

export default FleetList;
