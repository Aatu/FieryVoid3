import React from "react";

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );
};
