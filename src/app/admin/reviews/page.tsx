"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Star } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const { data, error: _error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id: string, newStatus: string) {
    try {
      await supabase
        .from('testimonials')
        .update({ status: newStatus })
        .eq('id', id);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1810] tracking-wide mb-2">Testimonials & Reviews</h1>
          <p className="font-sans text-[11px] text-[#7A6B5D] uppercase tracking-widest">
            Approve reviews to display them publicly on the live website.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center p-12 text-[#7A6B5D] font-sans text-sm">
            No testimonials found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFCF7] border-b border-[#D4AF37]/20">
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Date</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Customer</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Review</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Status</th>
                  <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => (
                  <tr key={rev.id} className="border-b border-[#D4AF37]/10 hover:bg-[#FFFCF7]/50 transition-colors">
                    <td className="px-6 py-4 font-sans text-xs text-[#2C1810] whitespace-nowrap">
                      {format(new Date(rev.created_at), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 font-sans text-xs font-semibold text-[#2C1810]">
                      {rev.name}
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="font-serif italic text-[11px] text-[#7A6B5D] line-clamp-2">"{rev.content}"</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[8px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 ${
                        rev.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                        rev.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {rev.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {rev.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {rev.status === 'pending' && <Clock className="w-3 h-3" />}
                        {rev.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2 items-center h-full">
                      {rev.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(rev.id, 'rejected')}
                            className="text-[9px] font-bold tracking-widest uppercase border border-red-200 text-red-600 px-3 py-1.5 hover:bg-red-50 transition-colors"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(rev.id, 'approved')}
                            className="text-[9px] font-bold tracking-widest uppercase bg-[#2C1810] text-[#D4AF37] px-3 py-1.5 hover:bg-[#4A0E17] transition-colors"
                          >
                            Approve
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(rev.id)}
                        className="text-[9px] font-bold tracking-widest uppercase border border-gray-200 text-gray-500 px-3 py-1.5 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        Delete
                      </button>
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
