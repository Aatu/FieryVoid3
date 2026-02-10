import * as React from "react";
import OEWButtons from "./OEWButtons";
import { useSelectedShip } from "../../../../state/useShip";
import { useUiStateHandler } from "../../../../state/useUIStateHandler";
import { useGameStore } from "../../GameStoreProvider";

const EwList: React.FC = () => {
  const ship = useSelectedShip();
  const uiState = useUiStateHandler();
  const gameData = uiState.getGameData();
  const ewList = useGameStore((state) => state.gameState.ewList);

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
