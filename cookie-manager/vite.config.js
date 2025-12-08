import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Rutas relativas para funcionar correctamente detrás de Nginx
  base: "./",

  // Servidor de desarrollo (local)
  server: {
    host: "0.0.0.0",
    port: 3001,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },

  // Servidor de producción (npm run preview)
  preview: {
    host: "0.0.0.0",
    port: 3001,
    strictPort: true,

    // Muy importante para que no bloquee tu dominio
    allowedHosts: ["components.duxleo.com"],
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
