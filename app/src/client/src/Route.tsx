import React, { ReactNode } from "react";
import { useUser } from "./state/userHooks";
import { useNavigate } from "react-router-dom";

export const Route: React.FC<{ isPrivate?: boolean; children: ReactNode }> = ({
  isPrivate,
  children,
}) => {
  const { data: currentUser, isLoading } = useUser();

  const navigate = useNavigate();

  if (isLoading) {
    return null;
  }

  const authed = Boolean(currentUser);

  if (!authed && isPrivate) {
    navigate("/");
  }

  return <>{children}</>;
};
