export const prerender = false;

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { LeadSchema } from "../../lib/validation/lead-schema";

// Inicializa o cliente Supabase
const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_API_KEY,
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // 1. Validação com Zod
    const result = LeadSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ errors: result.error.flatten() }), {
        status: 400,
      });
    }

    // 2. Salvar no Supabase
    const { data, error } = await supabase.from("leads").insert([
      {
        name: result.data.name,
        email: result.data.email,
        ddd: result.data.ddd,
        whatsapp: result.data.whatsapp,
        business: result.data.business,
        metadata: body.metadata, // Pegando o campo hidden que você já tinha
      },
    ]);

    if (error) throw error;

    // 3. (Opcional) Aqui você poderia disparar o e-mail do Resend também...

    return new Response(
      JSON.stringify({ message: "Lead salvo com sucesso no banco de dados!" }),
      { status: 200 },
    );
  } catch (err) {
    console.error("Erro no servidor: ", err);
    return new Response(
      JSON.stringify({
        message: "Erro ao salvar no banco de dados",
        details: err,
      }),
      { status: 500 },
    );
  }
};
