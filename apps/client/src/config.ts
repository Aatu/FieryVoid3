type Config = {
  env: {
    VITE_SERVER_URL: string;
    VITE_SERVER_WEBSOCKET_URL: string;
  };
};

export const SERVER_URL = (import.meta as unknown as Config).env
  .VITE_SERVER_URL;
export const SERVER_WEBSOCKET_URL = (import.meta as unknown as Config).env
  .VITE_SERVER_WEBSOCKET_URL;
