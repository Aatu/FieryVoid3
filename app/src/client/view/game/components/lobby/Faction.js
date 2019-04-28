import React, { Component } from "react";
import styled from "styled-components";
import {
  DarkContainer,
  Section,
  SubTitle,
  Button,
  Value
} from "../../../../styled";
import ships from "../../../../../model/unit/ships";

class Faction extends Component {
  buyShip(className) {
    const { buyShip } = this.props;
    return () => {
      buyShip(className);
    };
  }

  openShipWindow(ship) {
    return () => {
      const { uiState } = this.props;
      uiState.openShipWindow(ship);
    };
  }

  render() {
    const { faction } = this.props;

    return (
      <div>
        <SubTitle>{faction.name}</SubTitle>
        {faction.ships
          .map(ship => new ships[ship]())
          .map(ship => (
            <Section key={`fleetStoreEntry-${ship.shipClass}`}>
              <Button buttonStyle="text" onClick={this.openShipWindow(ship)}>
                {ship.shipTypeName} <Value>{ship.pointCost}</Value> points
              </Button>

              <Button
                buttonStyle="button"
                onClick={this.buyShip(ship.shipClass)}
              >
                Add to fleet
              </Button>
            </Section>
          ))}
      </div>
    );
  }
}

export default Faction;
