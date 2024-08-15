import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { getCurrentUser } from "../../state/actions";
import { logout as logoutUser } from "../../src/api/user";
import { DispatchStore, StateStore } from "../../state/StoreProvider";

const Logout = ({ location }) => {
  const dispatch = useContext(DispatchStore);
  const { currentUser } = useContext(StateStore);

  useEffect(() => {
    (async () => {
      await logoutUser();
      await getCurrentUser(dispatch);
    })();
  }, [dispatch]);

  if (!currentUser) {
    return <Redirect to={{ pathname: "/", state: { from: location } }} />;
  }

  return null;
};

export default Logout;
