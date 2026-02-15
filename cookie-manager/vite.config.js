import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react()],

    // Importante para funcionar detrás de Nginx o CDN
    base: "./",

    // ==========================
    // DEV SERVER
    // ==========================
    server: {
      host: "0.0.0.0",
      port: 3001,
      strictPort: true,

      // 🔓 Permite cualquier dominio en desarrollo
      allowedHosts: true,

      // Evita problemas si Streamlit está en otro dominio
      cors: true,

      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },

    // ==========================
    // PREVIEW (solo pruebas build)
    // ==========================
    preview: {
      host: "0.0.0.0",
      port: 3001,
      strictPort: true,

      // 🔓 Permite cualquier host también en preview
      allowedHosts: true,
      cors: true,
    },

    // ==========================
    // BUILD PRODUCCIÓN
    // ==========================
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: false,
      minify: "esbuild",
      target: "es2018",
    },
  };
});