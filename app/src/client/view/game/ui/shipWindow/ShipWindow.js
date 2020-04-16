import React, { useCallback, useMemo } from "react";
import styled from "styled-components";

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
  max-height: 100vh;
  overflow-y: scroll;
  margin: 0 8px;
  scrollbar-width: 0;

  &::-webkit-scrollbar {
    width: 0;
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

const ShipWindow = ({ ship, uiState, ...rest }) => {
  const shipWindowClicked = useCallback(() => {
    uiState.customEvent("closeSystemInfo");
  }, []);

  return (
    <ShipWindowContainer
      onClick={shipWindowClicked}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      team={ship.team}
    >
      <Column>
        <ShipSection
          uiState={uiState}
          ship={ship}
          section={ship.systems.sections.getPortFrontSection()}
          {...rest}
        />
        <ShipSection
          uiState={uiState}
          ship={ship}
          section={ship.systems.sections.getPortAftSection()}
          {...rest}
        />
      </Column>

      <ColumnMiddle>
        <ShipSection
          uiState={uiState}
          section={ship.systems.sections.getFrontSection()}
          ship={ship}
          {...rest}
        />
        <ShipSection
          uiState={uiState}
          ship={ship}
          section={ship.systems.sections.getPrimarySection()}
          {...rest}
        />
        <ShipSection
          uiState={uiState}
          ship={ship}
          section={ship.systems.sections.getAftSection()}
          {...rest}
        />
      </ColumnMiddle>

      <Column>
        <ShipSection
          uiState={uiState}
          ship={ship}
          section={ship.systems.sections.getStarboardFrontSection()}
          {...rest}
        />
        <ShipSection
          uiState={uiState}
          ship={ship}
          section={ship.systems.sections.getStarboardAftSection()}
          {...rest}
        />
      </Column>
    </ShipWindowContainer>
  );
};

export default ShipWindow;
