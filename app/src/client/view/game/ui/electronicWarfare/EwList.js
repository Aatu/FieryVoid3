import * as React from "react";
import OEWButtons from "./OEWButtons";

class EwList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { ship, uiState, ewList, selectedShip } = this.props;

    const { gameData } = uiState;
    if (!ship) {
      return null;
    }

    return ewList.map((entry, index) => {
      const target = gameData.ships.getShipById(entry.targetShipId);
      return (
        <OEWButtons
          highlight
          name={target.name}
          uiState={uiState}
          key={`ew-list-${index}`}
          ship={selectedShip}
          target={target}
          oew={selectedShip.electronicWarfare.getOffensiveEw(
            entry.targetShipId
          )}
        />
      );
    });
  }
}

export default EwList;
