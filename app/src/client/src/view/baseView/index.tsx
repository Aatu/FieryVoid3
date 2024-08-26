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

export const BaseView: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Logo />
      <HomeSceneComponent />
      <SuperContainer>
        <ContainerLeft>{children}</ContainerLeft>
        <ContainerRight>
          <Login />
        </ContainerRight>
      </SuperContainer>
    </>
  );
};
