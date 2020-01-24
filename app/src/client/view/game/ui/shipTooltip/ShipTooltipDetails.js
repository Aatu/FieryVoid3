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
  margin: 0 8px 5px 8px;
`;

const ShipDetailsTooltipEntry = styled(TooltipEntry)`
  margin: 2px 0;
`;

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
            `Acc: ${ship.accelcost}, Pivot: ${ship.pivotcost}, Evasion: ${ship.evasioncost}, Roll: ${ship.rollcost}`
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

        <Row>
          {this.getEntry(
            "Heat stored",
            `${ship.systems.getTotalHeatStored()}/${ship.systems.getTotalHeatStorage()}`
          )}

          {this.getEntry(
            "Passive heat change",
            ship.systems.getPassiveHeatChange()
          )}
        </Row>
      </Container>
    );
  }
}

export default ShipTooltipDetails;
