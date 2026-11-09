import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Site public. En développement, Vite transmet :
//   /api et /uploads → API du backend (port 4000)
//   /admin           → tableau de bord du backend (serveur Vite admin, port 5174)
const api = "http://localhost:4000";
const admin = {
  target: "http://localhost:5174",
  ws: true,
  // Le serveur Vite de l'admin attend « /admin/ » (avec la barre finale).
  rewrite: (p) => p.replace(/^\/admin(?=$|\?)/, "/admin/"),
};

const proxy = { "/api": api, "/uploads": api, "^/admin(?![\\w-])": admin };

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy },
  preview: { proxy },
});
