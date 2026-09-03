"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function CancellationsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const { data, error: _error } = await supabase
        .from('cancellations')
        .select(`
          *,
          profile:profiles(username, email),
          order:orders(total)
        `)
        .order('created_at', { ascending: false });
      
      if (data) setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id: string, newStatus: string) {
    try {
      await supabase
        .from('cancellations')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (newStatus === 'approved') {
        // Also update the order status
        const request = requests.find(r => r.id === id);
        if (request) {
          await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('order_id', request.order_id);
        }
      }
      
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1810] tracking-wide mb-2">Cancellation Requests</h1>
          <p className="font-sans text-[11px] text-[#7A6B5D] uppercase tracking-widest">
            Manage order cancellation requests from customers.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center p-12 text-[#7A6B5D] font-sans text-sm">
            No cancellation requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFCF7] border-b border-[#D4AF37]/20">
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Order ID</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Customer</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Reason</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Amount</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Status</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-[#D4AF37]/10 hover:bg-[#FFFCF7]/50 transition-colors">
                    <td className="px-6 py-4 font-sans text-xs text-[#2C1810]">
                      #{req.order_id}
                      <div className="text-[9px] text-[#7A6B5D] mt-1">{format(new Date(req.created_at), 'dd MMM yyyy, p')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-sans text-xs font-semibold text-[#2C1810]">
                          {req.profile?.username || 'Guest'}
                        </span>
                        <span className="font-sans text-[10px] text-[#7A6B5D]">
                          {req.profile?.email || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-sans text-xs text-[#2C1810] max-w-xs truncate">
                      {req.reason}
                    </td>
                    <td className="px-6 py-4 font-serif text-sm text-[#2C1810] font-bold">
                      ₹{req.order?.total?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[8px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 ${
                        req.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                        req.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {req.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {req.status === 'pending' && <Clock className="w-3 h-3" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(req.id, 'rejected')}
                            className="text-[9px] font-bold tracking-widest uppercase border border-red-200 text-red-600 px-3 py-1.5 hover:bg-red-50 transition-colors"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(req.id, 'approved')}
                            className="text-[9px] font-bold tracking-widest uppercase bg-[#2C1810] text-[#D4AF37] px-3 py-1.5 hover:bg-[#4A0E17] transition-colors"
                          >
                            Approve
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
