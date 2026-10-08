import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types/index.js';
import { settingsService } from '../services/settingsService.js';

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
}

const defaultSettings: SiteSettings = {
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
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.warn('Using default site settings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
