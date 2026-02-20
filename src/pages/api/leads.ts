import type { APIRoute } from "astro";
import { LeadSchema } from "../../lib/validation/lead-schema";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        }),
        { status: 400 },
      );
    }

    const { nome, email, ddd, whatsapp, business } = parsed.data;

    const telefoneNormalizado = `+55${ddd}${whatsapp}`;

    // Aqui você salva no banco futuramente

    console.log({
      nome,
      email,
      telefone: telefoneNormalizado,
      business,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
    });
  }
};
