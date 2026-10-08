import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required'),
    slug: z.string().optional(),
    shortDescription: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.coerce.number().positive('Price must be greater than 0'),
    compareAtPrice: z.coerce.number().positive().optional().nullable(),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative').default(100),
    sku: z.string().optional().nullable(),
    categoryId: z.coerce.number().int().optional().nullable(),
    featured: z.coerce.boolean().optional().default(false),
    active: z.coerce.boolean().optional().default(true),
    ingredients: z.string().optional().nullable(),
    benefits: z.string().optional().nullable(),
    usage: z.string().optional().nullable(),
    weight: z.string().optional().nullable(),
    images: z.array(z.object({
      url: z.string(),
      altText: z.string().optional(),
      order: z.number().optional().default(0),
      isPrimary: z.boolean().optional().default(false)
    })).optional()
  })
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Product ID must be numeric')
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().optional(),
    shortDescription: z.string().optional().nullable(),
    description: z.string().min(10).optional(),
    price: z.coerce.number().positive().optional(),
    compareAtPrice: z.coerce.number().positive().optional().nullable(),
    stock: z.coerce.number().int().min(0).optional(),
    sku: z.string().optional().nullable(),
    categoryId: z.coerce.number().int().optional().nullable(),
    featured: z.coerce.boolean().optional(),
    active: z.coerce.boolean().optional(),
    ingredients: z.string().optional().nullable(),
    benefits: z.string().optional().nullable(),
    usage: z.string().optional().nullable(),
    weight: z.string().optional().nullable(),
    images: z.array(z.object({
      url: z.string(),
      altText: z.string().optional(),
      order: z.number().optional().default(0),
      isPrimary: z.boolean().optional().default(false)
    })).optional()
  })
});
