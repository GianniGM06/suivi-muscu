import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Déployé sous https://<utilisateur>.github.io/suivi-muscu/
export default defineConfig({
  base: "/suivi-muscu/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/apple-touch-icon.png", "favicon.svg"],
      manifest: {
        name: "Suivi Muscu",
        short_name: "Muscu",
        description: "Suivi de musculation personnel — Programme Août 2026",
        lang: "fr",
        start_url: "/suivi-muscu/",
        scope: "/suivi-muscu/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#111418",
        theme_color: "#111418",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "/suivi-muscu/index.html"
      }
    })
  ],
  test: {
    environment: "node"
  }
} as never);
