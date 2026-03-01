// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

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
    partytown({
      config: {
        forward: ["dataLayer.push", "fbq", "gtag"],
        resolveUrl: (url) => {
          const facebookDomain = "connect.facebook.net";
          if (url.hostname === facebookDomain) {
            const proxyUrl = new URL(
              "https://www.mozellimarketing.com.br/api/proxy",
            );
            proxyUrl.searchParams.append("url", url.href);
            return proxyUrl;
          }
          // Bloqueio de telemetria das APIs obsoletas (SharedStorage/Attribution)
          // Isso ajuda a silenciar os avisos que derrubam as Boas Práticas
          if (
            url.href.includes("attribution_reporting") ||
            url.href.includes("shared_storage") ||
            url.href.includes("privacy-sandbox")
          ) {
            return new URL("data:text/javascript;base64,CWV2YWwoIiIpOw=="); // Retorna um script vazio
          }
          /*if (url.hostname.includes("google-analytics.com")) {
            return url;
          }*/
          return url;
        },
      },
    }),
  ],
  adapter: vercel({
    webAnalytics: {
      enabled: false,
    },
    imagesConfig: {
      sizes: [320, 640, 1200],
      domains: [],
      formats: ["image/avif", "image/webp"],
    },
  }),
});
