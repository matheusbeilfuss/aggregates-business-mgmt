import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "0.0.0"),
  },
  server: {
    allowedHosts:
      process.env.VITE_ALLOWED_HOSTS === "all"
        ? true
        : ["localhost", "127.0.0.1", "::1"],
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (reqPath) => reqPath.replace(/^\/api/, ""),
      },
    },
  },
});
