import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    storeName: z.string().min(2).optional(),
    phone: z.string().optional(),
    whatsappNumber: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    instagramUrl: z.string().url().optional().nullable().or(z.literal('')),
    facebookUrl: z.string().url().optional().nullable().or(z.literal('')),
    shippingCharge: z.coerce.number().min(0).optional(),
    freeShippingThreshold: z.coerce.number().min(0).optional(),
    codEnabled: z.coerce.boolean().optional(),
    razorpayEnabled: z.coerce.boolean().optional(),
    announcementText: z.string().optional(),
    heroTagline: z.string().optional(),
    heroSubtitle: z.string().optional(),
    footerText: z.string().optional()
  })
});
