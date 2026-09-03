"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { Mail, CheckCircle, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const { data, error: _error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsReplied(id: string) {
    try {
      await supabase
        .from('contact_messages')
        .update({ status: 'replied' })
        .eq('id', id);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1810] tracking-wide mb-2">Customer Inquiries</h1>
          <p className="font-sans text-[11px] text-[#7A6B5D] uppercase tracking-widest">
            Manage messages submitted through the Contact Us page.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center p-12 text-[#7A6B5D] font-sans text-sm">
            No messages found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFCF7] border-b border-[#D4AF37]/20">
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Date</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Customer</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Message</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Status</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id} className="border-b border-[#D4AF37]/10 hover:bg-[#FFFCF7]/50 transition-colors">
                    <td className="px-6 py-4 font-sans text-xs text-[#2C1810] whitespace-nowrap">
                      {format(new Date(msg.created_at), 'dd MMM yyyy')}
                      <div className="text-[9px] text-[#7A6B5D] mt-1">{format(new Date(msg.created_at), 'p')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-sans text-xs font-semibold text-[#2C1810]">
                          {msg.name}
                        </span>
                        <a href={`mailto:${msg.email}`} className="font-sans text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {msg.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-sans text-xs text-[#2C1810] max-w-md">
                      <div className="font-semibold mb-1">{msg.subject}</div>
                      <p className="line-clamp-2 text-[#7A6B5D]">{msg.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[8px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 ${
                        msg.status === 'replied' ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {msg.status === 'replied' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {msg.status !== 'replied' && (
                        <div className="flex justify-end gap-2">
                          <a 
                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                            className="text-[9px] font-bold tracking-widest uppercase border border-[#D4AF37] text-[#D4AF37] px-3 py-1.5 hover:bg-[#D4AF37]/10 transition-colors text-center"
                          >
                            Reply
                          </a>
                          <button 
                            onClick={() => markAsReplied(msg.id)}
                            className="text-[9px] font-bold tracking-widest uppercase bg-[#2C1810] text-[#D4AF37] px-3 py-1.5 hover:bg-[#4A0E17] transition-colors"
                          >
                            Mark Done
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
