import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// @ts-expect-error not now
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@fieryvoid3/model": path.resolve(
        // @ts-expect-error not now
        __dirname,
        "node_modules/@fieryvoid3/model"
      ),
    },
  },
  optimizeDeps: { include: ["@fieryvoid3/model"] },
});
