import React, { useEffect, useState } from 'react';
import { Mail, Phone, MessageCircle, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { adminService } from '../services/adminApi.js';
import { ContactMessage } from '../types/index.js';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMessages(statusFilter || undefined);
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to load contact messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await adminService.updateMessageStatus(id, status);
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, status: status as any } : m))
      );
    } catch (err) {
      alert('Failed to update inquiry status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Customer Inquiries</h1>
          <p className="text-xs text-slate-500 mt-1">Review contact form submissions and message replies.</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none shadow-xs"
        >
          <option value="">All Statuses</option>
          <option value="NEW">NEW</option>
          <option value="READ">READ</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading customer messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((m) => (
              <div key={m.id} className="p-6 hover:bg-slate-50/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'NEW'
                        ? 'bg-red-100 text-red-800'
                        : m.status === 'READ'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <a href={`mailto:${m.email}`} className="flex items-center gap-1 hover:text-brand-800">
                    <Mail size={13} /> {m.email}
                  </a>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="flex items-center gap-1 hover:text-brand-800">
                      <Phone size={13} /> {m.phone}
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl leading-relaxed whitespace-pre-line border border-slate-100">
                  {m.message}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">Mark as:</span>
                    {['NEW', 'READ', 'RESOLVED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(m.id, st)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-colors ${
                          m.status === st
                            ? 'bg-slate-800 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {m.phone && (
                      <a
                        href={`https://wa.me/91${m.phone}?text=${encodeURIComponent(`Hello ${m.name}, thank you for contacting Varsha Ayurveda regarding your message.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-whatsapp text-white rounded-lg text-xs font-bold hover:bg-whatsapp-dark"
                      >
                        <MessageCircle size={14} /> Reply on WhatsApp
                      </a>
                    )}
                    <a
                      href={`mailto:${m.email}?subject=Varsha Ayurveda - Response to your inquiry`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900"
                    >
                      <Mail size={14} /> Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
