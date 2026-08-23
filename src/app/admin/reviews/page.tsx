"use client";

import { useState, useEffect } from "react";
import { adminReviewService } from "@/services/admin/adminReviewService";
import { ReviewType } from "@/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import { Check, X, Trash2, Star, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const data = await adminReviewService.getAllReviews();
    setReviews(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
    const success = await adminReviewService.updateReviewStatus(id, status);
    if (success) {
      setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to permanently delete this review?")) {
      const success = await adminReviewService.deleteReview(id);
      if (success) {
        setReviews(reviews.filter(r => r.id !== id));
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen container mx-auto py-8">
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto space-y-6 py-8 md:py-12 px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-[1px] bg-[#D4AF37]" />
              <span className="text-[8px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
                Admin Panel
              </span>
            </div>
            <h1 className="font-serif text-3xl font-normal tracking-wide text-[#2C1810]" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              Review Moderation
            </h1>
            <p className="font-sans text-[11px] text-[#7A6B5D] tracking-wider uppercase mt-1">Approve or reject customer reviews</p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 gap-4">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-[#D4AF37]/15 bg-white shadow-sm">
              <MessageSquare className="text-[#D4AF37]/40 h-16 w-16 mb-4 stroke-[1]" />
              <h3 className="font-serif text-lg text-[#2C1810] tracking-wide mb-2" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                No reviews yet
              </h3>
            </div>
          ) : (
            reviews.map((review: any) => (
              <div key={review.id} className="bg-white border border-[#D4AF37]/15 p-5 flex flex-col md:flex-row gap-6 hover:border-[#D4AF37]/40 transition-colors">
                
                {/* Product Info */}
                <div className="flex items-center gap-4 md:w-1/4 shrink-0">
                  <div className="relative h-16 w-16 bg-[#f4f0ea] shrink-0 border border-[#D4AF37]/10">
                    {review.product?.image && (
                      <Image
                        src={review.product.image}
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-serif text-sm text-[#2C1810] truncate">{review.product?.title || "Unknown Product"}</span>
                    <span className="text-[9px] font-sans tracking-widest text-[#7A6B5D] uppercase mt-1">ID: {review.product_id?.slice(0, 8)}...</span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-[#2C1810] uppercase">
                      {review.profile?.username || "Guest User"}
                    </span>
                    <span className="text-[9px] text-[#7A6B5D] tracking-wide">
                      ({review.created_at ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true }) : 'Unknown date'})
                    </span>
                  </div>
                  <p className="text-sm text-[#4A4A4A] font-sans">"{review.comment}"</p>
                </div>

                {/* Actions & Status */}
                <div className="flex items-center gap-3 md:w-[200px] shrink-0 justify-end md:border-l md:border-[#D4AF37]/10 md:pl-6">
                  <div className="flex flex-col gap-2 w-full">
                    
                    {/* Status Display */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase">Status:</span>
                      <span className={`text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 ${
                        review.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                        review.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {review.status || 'pending'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {review.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(review.id, 'approved')}
                          className="flex-1 flex items-center justify-center h-8 bg-[#FDFBF7] border border-[#D4AF37]/30 text-[#2C1810] hover:bg-[#D4AF37] hover:text-white transition-colors"
                          title="Approve"
                        >
                          <Check className="h-3.5 w-3.5 stroke-[2]" />
                        </button>
                      )}
                      
                      {review.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(review.id, 'rejected')}
                          className="flex-1 flex items-center justify-center h-8 bg-[#FDFBF7] border border-[#4A0E17]/30 text-[#4A0E17] hover:bg-[#4A0E17] hover:text-white transition-colors"
                          title="Reject"
                        >
                          <X className="h-3.5 w-3.5 stroke-[2]" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(review.id)}
                        className="w-10 flex items-center justify-center h-8 bg-transparent hover:bg-red-50 text-red-400 hover:text-red-700 transition-colors"
                        title="Delete permanently"
                      >
                        <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
