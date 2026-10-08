import { prisma } from '../config/db.js';

export class SettingsService {
  static async getSettings() {
    let settings = await prisma.siteSettings.findFirst({
      where: { id: 1 }
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 1,
          storeName: "Varsha Ayurveda",
          phone: "9907303284",
          whatsappNumber: "919907303284",
          email: "info@varshaayurveda.in",
          address: "Berasia Road, Bhopal, Madhya Pradesh, India",
          shippingCharge: 50,
          freeShippingThreshold: 500,
          codEnabled: true,
          razorpayEnabled: true,
          announcementText: "Natural Ayurvedic Wellness Products | Order Online | WhatsApp Support",
          heroTagline: "Natural Wellness, Rooted in Ayurveda",
          heroSubtitle: "Discover thoughtfully crafted Ayurvedic and herbal products designed to support your everyday wellness routine.",
          footerText: "Bringing the goodness of Ayurveda to your daily life with natural and herbal wellness products."
        }
      });
    }

    return settings;
  }

  static async updateSettings(data: any) {
    return await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data
      }
    });
  }
}
