import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    date: z.date(),
    author: z.string().default('ProAxis Team'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    readTime: z.number().optional(),
  }),
});

export const collections = { blog };
