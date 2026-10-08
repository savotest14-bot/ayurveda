import { z } from 'zod';

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required'),
    slug: z.string().optional(),
    excerpt: z.string().min(5, 'Excerpt is required'),
    content: z.string().min(10, 'Content is required'),
    featuredImage: z.string().optional().nullable(),
    author: z.string().optional().default('Varsha Ayurveda Editorial'),
    published: z.coerce.boolean().optional().default(true)
  })
});

export const updateBlogSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Blog ID must be numeric')
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    slug: z.string().optional(),
    excerpt: z.string().min(5).optional(),
    content: z.string().min(10).optional(),
    featuredImage: z.string().optional().nullable(),
    author: z.string().optional(),
    published: z.coerce.boolean().optional()
  })
});
