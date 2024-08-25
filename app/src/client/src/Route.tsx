import React, { ReactNode } from "react";
import { useUser } from "./state/userHooks";
import { redirect } from "react-router-dom";

export const Route: React.FC<{ isPrivate?: boolean; children: ReactNode }> = ({
  isPrivate,
  children,
}) => {
  const { data: currentUser, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  const authed = Boolean(currentUser);

  if (!authed && isPrivate) {
    redirect("/");
    return null;
  }

  return <>{children}</>;
};
