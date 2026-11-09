import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Tableau de bord d'administration (dossier admin/), servi sous /admin.
// En développement : http://localhost:5174/admin (ou via le site public : http://localhost:5173/admin).
// En production : compilé dans dist/ puis servi par l'API (server/index.js).
const backendDir = fileURLToPath(new URL(".", import.meta.url));
const api = "http://localhost:4000";

export default defineConfig({
  root: "admin",
  base: "/admin/",
  plugins: [react(), tailwindcss()],
  build: { outDir: "../dist", emptyOutDir: true },
  server: {
    port: 5174,
    strictPort: true,
    // L'admin importe content/defaults.js, situé hors du dossier admin/.
    fs: { allow: [backendDir] },
    proxy: { "/api": api, "/uploads": api },
  },
});
