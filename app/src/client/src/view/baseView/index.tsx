import React, { Component } from "react";
import styled from "styled-components";
import HomeSceneComponent from "./HomeSceneComponent";
import { Route } from "../../Router";
import CreateGame from "../createGame";
import Home from "../home";
import Login from "../login/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Route isPrivate>
        <Home />
      </Route>
    ),
  },
  {
    path: "/createGame",
    element: (
      <Route isPrivate>
        <CreateGame />
      </Route>
    ),
  },
]);

export const BaseView: React.FC = () => {
  return (
    <>
      <Logo />
      <HomeSceneComponent />
      <SuperContainer>
        <ContainerLeft>
          <RouterProvider router={router} />
        </ContainerLeft>
        <ContainerRight>
          <Login />
        </ContainerRight>
      </SuperContainer>
    </>
  );
};
