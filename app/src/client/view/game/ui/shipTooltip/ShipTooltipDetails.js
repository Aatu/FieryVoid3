import * as React from "react";
import styled from "styled-components";
import {
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  TooltipValue,
  TooltipValueHeader
} from "../../../../styled";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Container = styled.div`
  margin-bottom: 5px;
`;

const ShipDetailsTooltipEntry = styled(TooltipEntry)``;

class ShipTooltipDetails extends React.Component {
  getEntry(header, value) {
    return (
      <ShipDetailsTooltipEntry>
        {header && <TooltipValueHeader>{header}: </TooltipValueHeader>}
        {value && <TooltipValue>{value}</TooltipValue>}
      </ShipDetailsTooltipEntry>
    );
  }
  render() {
    const { ship, uiState } = this.props;

    const { currentUser } = uiState.services;

    return (
      <Container>
        <Row>
          {this.getEntry(
            "Hit profile",
            `Front: ${ship.getFrontHitProfile()}, Side: ${ship.getSideHitProfile()}`
          )}
          {this.getEntry(
            "DEW",
            ship.electronicWarfare.inEffect.getDefensiveEw()
          )}
          {this.getEntry("CCEW", ship.electronicWarfare.inEffect.getCcEw())}
        </Row>
        <Row>
          {this.getEntry(
            "Movement costs",
            `Acceleration: ${ship.accelcost}, Pivot: ${ship.pivotcost}, Evasion: ${ship.evasioncost}, Roll: ${ship.rollcost}`
          )}
        </Row>
        <Row>
          {ship.player.isUsers(currentUser) &&
            this.getEntry(
              "Power available",
              ship.systems.power.getRemainingPowerOutput()
            )}

          {ship.player.isUsers(currentUser) &&
            this.getEntry(
              "Planned DEW",
              ship.electronicWarfare.getDefensiveEw()
            )}

          {ship.player.isUsers(currentUser) &&
            this.getEntry("Planned CCEW", ship.electronicWarfare.getCcEw())}
        </Row>
      </Container>
    );
  }
}

export default ShipTooltipDetails;
