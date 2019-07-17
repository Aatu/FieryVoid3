import * as React from "react";
import styled from "styled-components";

import { systemWindowBorder } from "../../../../styled";
import ShipSection from "./ShipSection";

const ShipWindowContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 400px;
  height: auto;
  opacity: 0.95;
  z-index: 10001;
  font-size: 10px;
  color: white;
  font-family: arial;

  @media (max-width: 1024px) {
    ${props => {
      if (props.team === 1) {
        return "left: 0; \n top: 0; \n right: unset;";
      } else {
        return "right: 0; \n top: 0; \n left: unset;";
      }
    }}
    max-height: 100vh;
    overflow-y: scroll;
  }
`;

const Column = styled.div`
  width: 25%;
  max-height: calc(33.3333333% - 11px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ColumnMiddle = styled(Column)`
  width: 50%;
`;

class ShipWindow extends React.Component {
  onShipMouseOver(event) {
    let { ship, uiState } = this.props;

    uiState.customEvent("SystemMouseOver", {
      ship: ship,
      system: ship,
      element: event.target
    });
  }

  onShipMouseOut() {
    let { uiState } = this.props;
    uiState.customEvent("SystemMouseOut");
  }

  close() {
    let { uiState } = this.props;
    uiState.closeShipWindow(this.props.ship);
  }

  render() {
    const { ship, uiState } = this.props;

    return (
      <ShipWindowContainer
        onClick={shipWindowClicked.bind(this, uiState)}
        onContextMenu={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        team={ship.team}
      >
        <Column>
          <ShipSection
            uiState={uiState}
            ship={ship}
            section={ship.systems.sections.getStarboardFrontSection()}
          />
          <ShipSection
            uiState={uiState}
            ship={ship}
            section={ship.systems.sections.getStarboardAftSection()}
          />
        </Column>

        <ColumnMiddle>
          <ShipSection
            uiState={uiState}
            section={ship.systems.sections.getFrontSection()}
            ship={ship}
          />
          <ShipSection
            uiState={uiState}
            ship={ship}
            section={ship.systems.sections.getPrimarySection()}
          />
          <ShipSection
            uiState={uiState}
            ship={ship}
            section={ship.systems.sections.getAftSection()}
          />
        </ColumnMiddle>

        <Column>
          <ShipSection
            uiState={uiState}
            ship={ship}
            section={ship.systems.sections.getPortFrontSection()}
          />
          <ShipSection
            uiState={uiState}
            ship={ship}
            section={ship.systems.sections.getPortAftSection()}
          />
        </Column>
      </ShipWindowContainer>
    );
  }
}

const shipWindowClicked = uiState => uiState.customEvent("CloseSystemInfo");

export default ShipWindow;
