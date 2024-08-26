import React from "react";
import { Section, SubTitle, Button, Value } from "../../../../styled";
import UIState from "../../ui/UIState";
import ships from "@fieryvoid3/model/src/unit/ships";
import Ship from "@fieryvoid3/model/src/unit/Ship";

type Props = {
  faction: { name: string; ships: string[] };
  buyShip: (className: string) => void;
  uiState: UIState;
};

const Faction: React.FC<Props> = ({ uiState, buyShip, faction }) => {
  const getBuyShip = (className: string) => {
    return () => {
      buyShip(className);
    };
  };

  const openShipWindow = (ship: Ship) => {
    return () => {
      uiState.showShipTooltip(ship, true, true);
    };
  };

  return (
    <div>
      <SubTitle>{faction.name}</SubTitle>
      {faction.ships
        .map((ship) => new ships[ship]())
        .map((ship) => (
          <Section key={`fleetStoreEntry-${ship.shipClass}`}>
            <Button buttonstyle="text" onClick={openShipWindow(ship)}>
              {ship.shipTypeName} <Value>{ship.pointCost}</Value> points
            </Button>

            <Button buttonstyle="button" onClick={getBuyShip(ship.shipClass)}>
              Add to fleet
            </Button>
          </Section>
        ))}
    </div>
  );
};

export default Faction;
