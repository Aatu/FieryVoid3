import React, { useContext } from "react";
import styled from "styled-components";
import { StateStore } from "../../state/StoreProvider";
import Login from "./Login";

const LoginFloaterContainer = styled(Login)`
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 3;
`;

const LoginFloater = () => {
  const { currentUser } = useContext(StateStore);

  console.log("Login floater", currentUser);
  if (currentUser) {
    return null;
  }

  return <LoginFloaterContainer />;
};

export default LoginFloater;
