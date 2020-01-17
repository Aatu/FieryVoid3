import React, { Component } from "react";
import styled from "styled-components";
import {
  Title,
  PanelContainer,
  Button,
  Link,
  TooltipContainer,
  TooltipHeader
} from "../../styled";
import HomeSceneComponent from "./HomeSceneComponent";
import Login from "../login/Login";
import LoginFloater from "../login/LoginFloater";

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

const SuperContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap-reverse;
  margin: 5px;
`;
const ContainerLeft = styled.div`
  width: 40%;
  min-width: 800px;
  margin: 5px;
`;

const ContainerRight = styled.div`
  width: 21%;
  min-width: 200px;
  margin: 5px;
`;

class Home extends Component {
  render() {
    return (
      <>
        <Logo />
        <HomeSceneComponent />
        <SuperContainer>
          <ContainerLeft>
            <TooltipContainer>
              <TooltipHeader>Home</TooltipHeader>

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
            </TooltipContainer>
          </ContainerLeft>
          <ContainerRight>
            <Login />
          </ContainerRight>
        </SuperContainer>
      </>
    );
  }
}

export default Home;
