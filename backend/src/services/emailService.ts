import { transporter } from '../config/mailer.js';
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class EmailService {
  static async sendOrderConfirmation(order: any) {
    if (!ENV.SMTP_USER) {
      logger.info(`[Email Simulated] Order confirmation for #${order.orderNumber} to ${order.customerEmail}`);
      return;
    }

    try {
      const itemsList = order.items.map((i: any) =>
        `• ${i.productName} (Qty: ${i.quantity}) - ₹${i.total}`
      ).join('\n');

      const mailOptions = {
        from: ENV.SMTP_FROM,
        to: order.customerEmail,
        subject: `Order Confirmed: #${order.orderNumber} - Varsha Ayurveda`,
        text: `Namaste ${order.customerName},\n\nThank you for choosing Varsha Ayurveda. Your order #${order.orderNumber} has been received.\n\nItems:\n${itemsList}\n\nSubtotal: ₹${order.subtotal}\nShipping: ₹${order.shippingCharge}\nTotal Amount: ₹${order.totalAmount}\nPayment Method: ${order.paymentMethod}\n\nShipping Address:\n${order.shippingAddress}, ${order.city}, ${order.state} - ${order.pincode}\n\nFor any queries, reply to this email or message us on WhatsApp at +${ENV.WHATSAPP_NUMBER}.\n\nWarm Regards,\nVarsha Ayurveda Team`
      };

      await transporter.sendMail(mailOptions);
      logger.info(`Order confirmation email sent to ${order.customerEmail}`);
    } catch (err: any) {
      logger.error('Failed to send order confirmation email', err);
    }
  }

  static async sendContactNotification(contact: any) {
    if (!ENV.SMTP_USER) {
      logger.info(`[Email Simulated] Contact inquiry from ${contact.name} (${contact.email})`);
      return;
    }

    try {
      const mailOptions = {
        from: ENV.SMTP_FROM,
        to: ENV.SMTP_USER,
        subject: `New Inquiry from ${contact.name} - Varsha Ayurveda`,
        text: `Name: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || 'N/A'}\n\nMessage:\n${contact.message}`
      };

      await transporter.sendMail(mailOptions);
    } catch (err: any) {
      logger.error('Failed to send contact inquiry notification email', err);
    }
  }
}
