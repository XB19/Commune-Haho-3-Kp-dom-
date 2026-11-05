import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// L'API (server/index.js) tourne sur le port 4000 ; Vite lui transmet /api et /uploads.
const api = "http://localhost:4000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: { "/api": api, "/uploads": api },
  },
  preview: {
    proxy: { "/api": api, "/uploads": api },
  },
});
