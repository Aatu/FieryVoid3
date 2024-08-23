import * as React from "react";
import OEWButtons from "./OEWButtons";
import ElectronicWarfareEntry from "@fieryvoid3/model/src/electronicWarfare/ElectronicWarfareEntry";
import UIState from "../UIState";
import Ship from "@fieryvoid3/model/src/unit/Ship";

type Props = {
  ship: Ship;
  uiState: UIState;
  ewList: ElectronicWarfareEntry[];
};

const EwList: React.FC<Props> = ({ ship, uiState, ewList }) => {
  const gameData = uiState.getGameData();
  if (!ship) {
    return null;
  }

  return ewList.map((entry, index) => {
    const target = gameData.ships.getShipById(entry.targetShipId);
    return (
      <OEWButtons
        name={target.name || undefined}
        uiState={uiState}
        key={`ew-list-${index}`}
        ship={ship}
        target={target}
        oew={ship.electronicWarfare.getOffensiveEw(entry.targetShipId)}
      />
    );
  });
};

export default EwList;
