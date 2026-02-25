// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.mozellimarketing.com.br",
  // Força a geração de URLs amigáveis e consistentes
  trailingSlash: "ignore",
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Melhora a minificação de CSS e JS
      cssMinify: "lightningcss",
      assetsInlineLimit: 4096, // Transforma ícones pequenos em Base64 para reduzir requests HTTP
    },
  },

  integrations: [
    sitemap({
      lastmod: new Date(),
      changefreq: "weekly",
      priority: 0.7,
    }),
  ],
  adapter: vercel({
    webAnalytics: {
      enabled: false,
    },
    imagesConfig: {
      sizes: [320, 640, 1200],
      domains: [],
      formats: ["image/webp", "image/avif"],
    },
  }),
});
