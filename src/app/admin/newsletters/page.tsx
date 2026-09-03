"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { Mail, CheckCircle, Download } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function NewslettersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    try {
      const { data, error: _error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setSubscribers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    if (subscribers.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Status,Subscribed_At\n"
      + subscribers.map(s => `${s.email},${s.status},${s.created_at}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hanger_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1810] tracking-wide mb-2">Newsletter Subscribers</h1>
          <p className="font-sans text-[11px] text-[#7A6B5D] uppercase tracking-widest">
            Manage your email marketing audience.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-[#2C1810] text-[#D4AF37] px-6 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#4A0E17] transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center p-12 text-[#7A6B5D] font-sans text-sm">
            No subscribers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFCF7] border-b border-[#D4AF37]/20">
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Email Address</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Subscribed At</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, idx) => (
                  <tr key={idx} className="border-b border-[#D4AF37]/10 hover:bg-[#FFFCF7]/50 transition-colors">
                    <td className="px-6 py-4 font-sans text-xs font-semibold text-[#2C1810] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#D4AF37]" /> {sub.email}
                    </td>
                    <td className="px-6 py-4 font-sans text-xs text-[#7A6B5D]">
                      {format(new Date(sub.created_at), 'dd MMM yyyy, p')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[8px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 ${
                        sub.status === 'subscribed' ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        {sub.status === 'subscribed' && <CheckCircle className="w-3 h-3" />}
                        {sub.status}
                      </span>
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
