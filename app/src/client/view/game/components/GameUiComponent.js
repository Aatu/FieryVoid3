import * as React from "react";
import Lobby from "./Lobby";

class GameUiComponent extends React.Component {
  render() {
    const { uiState, game } = this.props;
    return (
      <>{uiState.lobby && <Lobby gameData={uiState.gameData} game={game} />}</>
    );
  }
}

export default GameUiComponent;
