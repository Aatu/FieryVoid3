import React, { useEffect } from "react";
import { useLogout, useUser } from "../../state/userHooks";
import { redirect } from "react-router-dom";

const Logout: React.FC = () => {
  const { data: currentUser, isLoading } = useUser();

  const { mutate: logout, isPending } = useLogout();

  useEffect(() => {
    if (isLoading || isPending) {
      return;
    }

    if (currentUser === null) {
      logout();
    } else {
      redirect("/");
    }
  }, [currentUser, isLoading, isPending, logout]);

  return null;
};

export default Logout;
