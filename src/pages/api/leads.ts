export const prerender = false;

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { LeadSchema } from "../../lib/validation/lead-schema";
import { Resend } from "resend";

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
        site: result.data.site,
        empresa: result.data.enterprise,
        ddd: result.data.ddd,
        whatsapp: result.data.whatsapp,
        business: result.data.business,
        metadata: result.data.metadata,
      },
    ]);

    if (error) throw error;

    // 3. (Opcional) Aqui você poderia disparar o e-mail do Resend também...

    const { name, email, site, enterprise, ddd, whatsapp, business, metadata } =
      result.data;
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    console.log(result.data);

    console.log(import.meta.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "joaomozelli@hotmail.com",
      subject: `Novo lead capturado! ${name}`,
      html: `
        <h1>Novo Lead no Sistema</h1>
        <p><strong>Nome:</strong> ${name}<p>
        <p><strong>E-mail:</strong> ${email}<p>
        <p><strong>Site:</strong> ${site}<p>
        <p><strong>Empresa:</strong> ${enterprise}<p>
        <p><strong>DDD:</strong> ${ddd}<p>
        <p><strong>WhatsApp:</strong> ${whatsapp}<p>
        <p><strong>Ramo de atividade:</strong> ${business}<p>
        <p><strong>Data:</strong> <em>${new Date().toLocaleString("pt-BR")}</em><p>
        <p><strong>Metadata:</strong> <em>${metadata}</em><p>
      `,
    });
    return new Response(
      JSON.stringify({ message: "Lead salvo com sucesso no banco de dados!" }),
      { status: 200 },
    );
  } catch (err) {
    console.error("Erro no servidor: ", err);
    return new Response(
      JSON.stringify({
        message: "❌ Algo deu errado ao tentar salvar um novo lead.",
        details: err,
      }),
      { status: 500 },
    );
  }
};
