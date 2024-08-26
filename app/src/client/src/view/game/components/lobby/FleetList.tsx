import React from "react";
import styled from "styled-components";

import {
  SubTitle,
  DarkContainer,
  Section,
  SectionRight,
  Button,
} from "../../../../styled";
import { PurchasedShip } from "./PurchasedShip";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import UIState from "../../ui/UIState";

const FleetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 440px;
  justify-content: space-around;
  margin-top: 16px;
`;

type Props = {
  ships: Ship[];
  onReady: () => void;
  bought: boolean;
  uiState: UIState;
};

const FleetList: React.FC<Props> = ({ ships, onReady, bought, uiState }) => {
  return (
    <DarkContainer>
      <Section>
        <SubTitle>Current fleet for slot</SubTitle>
        <SectionRight>
          {!bought && ships.length > 0 && (
            <Button buttonstyle="button" onClick={onReady}>
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
};

export default FleetList;
