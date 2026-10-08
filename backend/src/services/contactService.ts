import { prisma } from '../config/db.js';
import { ApiError } from '../utils/apiResponse.js';
import { ContactMessageStatus } from '@prisma/client';
import { EmailService } from './emailService.js';

export class ContactService {
  static async submitMessage(data: { name: string; email: string; phone?: string; message: string }) {
    const contact = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        status: ContactMessageStatus.NEW
      }
    });

    // Send email notification in background
    EmailService.sendContactNotification(contact).catch(() => {});

    return contact;
  }

  static async getAll(status?: ContactMessageStatus) {
    const where = status ? { status } : {};
    return await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateStatus(id: number, status: ContactMessageStatus) {
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) {
      throw new ApiError(404, 'Contact message not found');
    }

    return await prisma.contactMessage.update({
      where: { id },
      data: { status }
    });
  }
}
