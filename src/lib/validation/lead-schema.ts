import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  site: z.string().nullable(),
  ddd: z.string().regex(/^\d{2}$/, "DDD inválido"),
  whatsapp: z.string().regex(/^\d{9}$/, "WhatsApp inválido"),
  business: z.string().min(2, "Informe o ramo de atividade"),
  metadata: z.string(),
});

export type LeadInput = z.infer<typeof LeadSchema>;
