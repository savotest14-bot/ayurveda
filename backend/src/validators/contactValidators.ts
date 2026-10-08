import { z } from 'zod';
import { ContactMessageStatus } from '@prisma/client';

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email address is required'),
    phone: z.string().regex(/^[0-9+ ]{10,15}$/, 'Valid phone number is required').optional().nullable(),
    message: z.string().min(10, 'Message must be at least 10 characters')
  })
});

export const updateContactStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Message ID must be numeric')
  }),
  body: z.object({
    status: z.nativeEnum(ContactMessageStatus)
  })
});
