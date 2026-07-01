import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version ?? "0.0.0",
      ),
    },
    server: {
      allowedHosts: (() => {
        const raw = env.VITE_ALLOWED_HOSTS?.trim();
        if (!raw) return ["localhost", "127.0.0.1", "::1"];
        if (raw === "all") return true;
        return raw
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean);
      })(),
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
          rewrite: (reqPath) => reqPath.replace(/^\/api/, ""),
        },
      },
    },
  };
});
