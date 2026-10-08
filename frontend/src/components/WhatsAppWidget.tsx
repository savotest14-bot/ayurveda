import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';

export const WhatsAppWidget: React.FC = () => {
  const { settings } = useSettings();
  const whatsappNum = settings?.whatsappNumber || '919907303284';

  return (
    <a
      href={`https://wa.me/${whatsappNum}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-whatsapp text-white p-4 rounded-full shadow-2xl hover:bg-whatsapp-dark transition-all hover:scale-110 z-40 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with us!
      </span>
    </a>
  );
};
