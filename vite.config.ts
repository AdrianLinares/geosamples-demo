// Configuración de Vite para el SPA (design D1): plugin de React, proxy
// /api → backend :3001, alias `@` → ./src y entorno de pruebas happy-dom
// solo para los archivos del SPA (los tests del server siguen en node).
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  test: {
    environment: "node",
    environmentMatchGlobs: [["src/**", "happy-dom"]],
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});