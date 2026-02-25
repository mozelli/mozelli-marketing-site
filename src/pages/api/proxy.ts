import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing URL parameter", { status: 400 });
  }

  try {
    const response = await fetch(targetUrl);
    const blob = await response.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "text/javascript",
        "Access-Control-Allow-Origin": "*", // Permite que o Partytown leia o arquivo
      },
    });
  } catch (e) {
    return new Response("Proxy error", { status: 500 });
  }
};
