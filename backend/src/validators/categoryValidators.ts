import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name is required'),
    slug: z.string().optional(),
    description: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    active: z.coerce.boolean().optional().default(true),
    sortOrder: z.coerce.number().int().optional().default(0)
  })
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Category ID must be numeric')
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().optional(),
    description: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    active: z.coerce.boolean().optional(),
    sortOrder: z.coerce.number().int().optional()
  })
});
