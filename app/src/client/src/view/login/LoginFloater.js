import React, { useContext } from "react";
import styled from "styled-components";
import { StateStore } from "../../state/StoreProvider";
import Login from "./Login";

const LoginFloaterContainer = styled(Login)`
  position: absolute;
  width: 20%;
  min-width: 200px;
  right: 10px;
  top: 10px;
  z-index: 3;
`;

const LoginFloater = () => {
  const { currentUser } = useContext(StateStore);

  if (currentUser) {
    return null;
  }

  return <LoginFloaterContainer />;
};

export default LoginFloater;
