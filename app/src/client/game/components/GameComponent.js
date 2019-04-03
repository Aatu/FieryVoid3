import * as React from "react";
import GameSceneComponent from "./GameSceneComponent";
import Game from "../Game";
import UIState from "../ui/UIState";

class GameComponent extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    console.log(props);
    this.uiState = new UIState();
    this.game = new Game(match.params.gameid);
  }

  render() {
    return <GameSceneComponent game={this.game} />;
  }
}

export default GameComponent;
