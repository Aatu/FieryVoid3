import * as React from "react";
import GameSceneComponent from "./GameSceneComponent";
import Game from "../Game";
import UIState from "../ui/UIState";
import { connect } from "react-redux";
import GameUiComponent from "./GameUiComponent";

class GameComponent extends React.Component {
  constructor(props) {
    super(props);
    const { match, user } = props;
    this.uiState = new UIState();
    this.state = this.uiState.state;
    this.game = new Game(match.params.gameid, user, this.uiState);
  }

  componentDidMount() {
    this.uiState.init(this.setState.bind(this));
  }

  render() {
    const { user } = this.props;

    if (user === undefined) {
      return null;
    }

    return (
      <>
        <GameSceneComponent game={this.game} />
        <GameUiComponent game={this.game} uiState={this.state} user={user} />
      </>
    );
  }
}

export default connect(({ user }) => ({
  user: user.current
}))(GameComponent);
