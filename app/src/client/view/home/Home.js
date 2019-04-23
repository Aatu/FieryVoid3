import React, { Component } from "react";
import {
  Title,
  InputAndLabel,
  PanelContainer,
  Button,
  Error,
  Link
} from "../../styled";

class Home extends Component {
  render() {
    return (
      <PanelContainer>
        <Title>Home</Title>

        <Link to="/createGame">
          <Button type="button" buttonStyle="button-grey">
            Create game
          </Button>
        </Link>
        <Link to="/logout">
          <Button type="button" buttonStyle="button-grey">
            Log out
          </Button>
        </Link>
      </PanelContainer>
    );
  }
}

export default Home;
