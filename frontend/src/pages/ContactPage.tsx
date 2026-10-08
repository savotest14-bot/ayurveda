import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { contactService } from '../services/contactService.js';
import { useSettings } from '../context/SettingsContext.js';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await contactService.submitMessage(formData);
      setSuccessMsg(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to send message. Please try again or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappNum = settings?.whatsappNumber || '919907303284';
  const displayPhone = settings?.phone || '9907303284';
  const email = settings?.email || 'info@varshaayurveda.in';
  const address = settings?.address || 'Berasia Road, Bhopal, Madhya Pradesh, India';

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      {/* Header Banner */}
      <div
        className="relative text-white py-14 md:py-20 bg-[#0c3c22] bg-cover bg-center bg-no-repeat overflow-hidden shadow-sm"
        style={{ backgroundImage: `url('/images/bannerimg.png')` }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 text-white drop-shadow-md">
            Contact Us
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-xl mx-auto font-medium drop-shadow-xs">
            Connect with our Ayurvedic consultants or inquire about our herbal products.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
          {/* Contact Details Column */}
          <div className="space-y-8 bg-cream p-8 md:p-10 rounded-3xl border border-brand-50">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Get in Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-white text-brand-700 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">Our Location</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-white text-brand-700 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">Phone / WhatsApp</h3>
                  <p className="text-gray-600 text-sm">+{whatsappNum}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-white text-brand-700 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">Email Address</h3>
                  <p className="text-gray-600 text-sm">{email}</p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${whatsappNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-white px-5 py-3 rounded-xl font-bold hover:bg-whatsapp-dark transition-colors text-sm shadow-md"
            >
              <MessageCircle size={18} /> Chat with us on WhatsApp ({displayPhone})
            </a>
          </div>

          {/* Contact Form Column */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Send us a Message</h2>

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center gap-3">
                <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Thank you! Your message has been received. Our wellness team will contact you shortly.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3">
                <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none bg-gray-50 transition-all text-sm"
                  placeholder="Your Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none bg-gray-50 transition-all text-sm"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none bg-gray-50 transition-all text-sm"
                  placeholder="e.g. 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none bg-gray-50 transition-all resize-none text-sm"
                  placeholder="How can we help your wellness journey?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-800 text-white font-bold py-3.5 rounded-xl hover:bg-brand-900 transition-colors shadow-md text-base flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Sending Message...' : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
