import * as React from "react";
import GameSceneComponent from "./GameSceneComponent";
import Game from "../source/Game";

class GameComponent extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    console.log(props);
    this.game = new Game(match.params.gameid);
  }

  render() {
    return <GameSceneComponent game={this.game} />;
  }
}

export default GameComponent;
