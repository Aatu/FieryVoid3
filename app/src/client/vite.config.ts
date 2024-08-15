import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// @ts-expect-error not now
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @ts-expect-error not now
      "@model": path.resolve(__dirname, "../model/src"),
    },
  },
});
