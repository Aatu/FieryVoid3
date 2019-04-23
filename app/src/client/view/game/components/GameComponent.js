import * as React from "react";
import GameSceneComponent from "./GameSceneComponent";
import Game from "../Game";
import UIState from "../ui/UIState";
import getStore from "../../../state/store";
import { connect } from "react-redux";

class GameComponent extends React.Component {
  constructor(props) {
    super(props);
    const { match, user } = props;
    console.log(props);
    this.uiState = new UIState(getStore());
    this.game = new Game(match.params.gameid, user);
  }

  render() {
    return <GameSceneComponent game={this.game} />;
  }
}

export default connect(({ user }) => ({
  user: user.current
}))(GameComponent);
