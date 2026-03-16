import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image(),
      thumbnail: image(),
    }),
});

export const collections = { blog };

/*const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    author: z.string(),
    pubDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default(["geral"]),
    status: z.string().default("rascunho"),
  }),
});*/
