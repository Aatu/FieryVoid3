import React from "react";
import styled from "styled-components";
import Login from "./Login";
import { useUser } from "../../state/userHooks";

const LoginFloaterContainer = styled(Login)`
  position: absolute;
  width: 20%;
  min-width: 200px;
  right: 10px;
  top: 10px;
  z-index: 3;
`;

const LoginFloater: React.FC = () => {
  const { data: currentUser } = useUser();

  if (currentUser) {
    return null;
  }

  return <LoginFloaterContainer />;
};

export default LoginFloater;
