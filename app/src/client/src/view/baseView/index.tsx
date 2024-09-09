import React, { ReactNode } from "react";
import styled from "styled-components";
import HomeSceneComponent from "./HomeSceneComponent";
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

export const ContainerMain = styled.div`
  width: 100%;
  min-width: 800px;
  margin-top: 150px;
`;

export const LoginContainer = styled.div`
  width: 21%;
  min-width: 200px;
  position: absolute;
  right: 16px;
  top: 16px;
`;

export const BaseView: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Logo />
      <HomeSceneComponent />
      <LoginContainer>
        <Login />
      </LoginContainer>

      <ContainerMain>{children}</ContainerMain>
    </>
  );
};
