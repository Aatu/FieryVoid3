import React, { Component } from "react";
import styled from "styled-components";
import HomeSceneComponent from "./HomeSceneComponent";
import { Router, Route } from "react-router-dom";
import { PrivateRoute } from "../../Router";
import CreateGame from "../createGame";
import Home from "../home";
import Login from "../login/Login";

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

export const SuperContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap-reverse;
  margin: 5px;
`;

export const ContainerLeft = styled.div`
  width: 40%;
  min-width: 800px;
  margin: 5px;
`;

export const ContainerRight = styled.div`
  width: 21%;
  min-width: 200px;
  margin: 5px;
`;

export const BaseView = () => {
  return (
    <>
      <Logo />
      <HomeSceneComponent />
      <SuperContainer>
        <ContainerLeft>
          <Route exact path="/" component={Home} />
          <PrivateRoute exact path="/createGame" component={CreateGame} />
        </ContainerLeft>
        <ContainerRight>
          <Login />
        </ContainerRight>
      </SuperContainer>
    </>
  );
};
