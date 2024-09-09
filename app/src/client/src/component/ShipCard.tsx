import Ship from "@fieryvoid3/model/src/unit/Ship";
import styled from "styled-components";
import { StaticShipViewComponent } from "./ShipView/StaticShipViewComponent";
import { useUiStateHandler } from "../state/useUIStateHandler";

type Props = {
  ship: Ship;
  size: number;
};

const Container = styled.div`
  border: 1px solid #aaaaaa;
`;

export const ShipCard: React.FC<Props> = ({ ship, size }) => {
  const uiState = useUiStateHandler();

  console.log("I has uiState", uiState);

  return (
    <Container onClick={() => uiState.showShipTooltip(ship, true, false)}>
      <StaticShipViewComponent ship={ship} size={size} />
    </Container>
  );
};
