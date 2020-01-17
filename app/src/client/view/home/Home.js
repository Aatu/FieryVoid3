import React, { Component } from "react";
import styled from "styled-components";
import { Title, PanelContainer, Button, Link } from "../../styled";
import LoginFloater from "../login/LoginFloater";
import HomeSceneComponent from "./HomeSceneComponent";

const Logo = styled.div`
  height: 58px;
  width: 412px;
  background-image: url(img/coldvoid.png);
  position: absolute;
  top: 45px;
  left: 30px;
  opacity: 0.8;
  z-index: -1;
`;

class Home extends Component {
  render() {
    return (
      <>
        <Logo />
        <HomeSceneComponent />
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
        <LoginFloater />
      </>
    );
  }
}

export default Home;
