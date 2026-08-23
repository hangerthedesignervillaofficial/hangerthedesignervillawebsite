"use client";

import { useState, useMemo } from "react";

import { Progress } from "@/components/ui/progress";
import { useGetProductReviews, useCreateReview } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProductType, ReviewType } from "@/types";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ReviewedCard } from "./reviewed-card";
import { useQueryClient } from "@tanstack/react-query";
import { reviewKeys } from "@/hooks/queries";

type ProductDetailsClientProps = {
  product: ProductType;
};

export function ReviewTab({ product }: ProductDetailsClientProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: reviewsData } = useGetProductReviews(product.product_id);

  const createReviewMutation = useCreateReview();

  // Ensure reviews is always an array (handle null/undefined) with stable reference
  const reviews = useMemo(() => reviewsData ?? [], [reviewsData]);

  // Check if current user has already reviewed
  const userReview = useMemo(() => {
    if (!user) return null;
    return (
      reviews.find((review: ReviewType) => review.user_id === user.id) || null
    );
  }, [reviews, user]);

  // Calculate real rating distribution from actual reviews
  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });

    const total = reviews.length || 1;

    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      percentage: Math.round(
        (distribution[stars as keyof typeof distribution] / total) * 100,
      ),
      count: distribution[stars as keyof typeof distribution],
    }));
  }, [reviews]);

  // Calculate review stats from actual reviews
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  }, [reviews]);

  const reviewCount = reviews.length;

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReviewMutation.mutateAsync({
        productId: product.product_id,
        rating,
        comment: comment.trim(),
      });

      // Manually refetch reviews to ensure they update immediately
      await queryClient.refetchQueries({
        queryKey: reviewKeys.list(product.product_id),
      });

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      setHoveredRating(0);
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="border border-[#D4AF37]/20 bg-[#FDFBF7] p-6 relative overflow-hidden rounded-none shadow-sm">
        <div className="absolute inset-2 border border-[#D4AF37]/5 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-6 text-center">
            <span className="font-sans text-[8px] font-bold tracking-[0.25em] text-[#D4AF37] mb-1.5 uppercase block">
              Average Rating
            </span>
            <div className="mb-2 text-4xl font-serif font-bold text-[#2C1810]">
              {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
            </div>
            {averageRating > 0 && (
              <div className="flex justify-center">
                {RenderStars(averageRating)}
              </div>
            )}
            <p className="text-[#7A6B5D] mt-2 text-xs font-sans">
              Based on {reviewCount.toLocaleString()}{" "}
              {reviewCount === 1 ? "review" : "reviews"}
            </p>
          </div>

          {reviewCount > 0 ? (
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="w-6 text-xs font-sans text-[#2C1810] font-bold">{item.stars}★</span>
                  <Progress 
                    value={item.percentage} 
                    className="flex-1 h-1.5 bg-gray-100 [&>div]:bg-[#D4AF37]" 
                  />
                  <span className="text-[#7A6B5D] w-10 text-xs text-right font-sans">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#7A6B5D] text-center text-xs font-sans">
              No ratings yet
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 lg:col-span-2">
        {/* Add Review Button */}
        {user && !userReview && !showReviewForm && (
          <div className="border border-[#D4AF37]/20 bg-[#FDFBF7] p-6 relative overflow-hidden rounded-none shadow-sm">
            <div className="absolute inset-2 border border-[#D4AF37]/5 pointer-events-none" />
            <div className="relative z-10 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2C1810]">SHARE YOUR EXPERIENCES</h4>
                <p className="font-sans text-xs text-[#7A6B5D] mt-0.5">Tell other customers what you think about this product</p>
              </div>
              <Button
                onClick={() => setShowReviewForm(true)}
                className="cursor-pointer bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] border border-[#D4AF37]/35 rounded-none font-sans font-bold tracking-[0.18em] text-[10px] h-10 px-5 transition-colors"
              >
                Write a Review
              </Button>
            </div>
          </div>
        )}

        {/* Review Form */}
        {user && !userReview && showReviewForm && (
          <div className="border border-[#D4AF37]/20 bg-[#FDFBF7] p-6 relative overflow-hidden rounded-none shadow-sm space-y-4">
            <div className="absolute inset-2 border border-[#D4AF37]/5 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-3 mb-4">
                <h3 className="font-serif font-bold text-base text-[#2C1810] tracking-wide">Write a Review</h3>
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setRating(0);
                    setComment("");
                    setHoveredRating(0);
                  }}
                  className="font-sans text-[10px] font-bold tracking-widest text-[#7A6B5D] hover:text-[#4A0E17] transition-colors cursor-pointer uppercase"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold font-sans tracking-wider uppercase text-[#2C1810]">Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="cursor-pointer focus:outline-none transition-transform active:scale-90"
                      >
                        <Star
                          className={`h-6 w-6 transition-all ${
                            star <= (hoveredRating || rating)
                              ? "fill-[#D4AF37] text-[#D4AF37] scale-110"
                              : "text-gray-300 hover:text-[#D4AF37]"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold font-sans tracking-wider uppercase text-[#2C1810]">
                    Your Review
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="min-h-[100px] bg-white border border-[#D4AF37]/20 rounded-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] font-sans text-sm text-[#2C1810] placeholder:text-gray-400"
                    maxLength={500}
                  />
                  <div className="text-[#7A6B5D] mt-1 text-[10px] font-sans text-right">
                    {comment.length}/500 characters
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={!comment.trim() || rating === 0 || isSubmitting}
                    className="cursor-pointer bg-gradient-to-r from-[#2C1810] to-[#4A0E17] text-[#D4AF37] border border-[#D4AF37]/35 rounded-none font-sans font-bold tracking-[0.18em] text-[10px] h-10 px-5 transition-colors disabled:opacity-40"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
                      setRating(0);
                      setComment("");
                      setHoveredRating(0);
                    }}
                    className="cursor-pointer border border-[#D4AF37]/20 text-[#2C1810] hover:bg-[#FDFBF7] rounded-none font-sans font-bold tracking-[0.18em] text-[10px] h-10 px-5 transition-colors"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {user && userReview && (
          <div className="border border-[#D4AF37]/10 bg-white p-6 rounded-none text-center">
            <p className="text-[#7A6B5D] text-xs font-sans">
              You have already reviewed this product.
            </p>
          </div>
        )}

        {!user && (
          <div className="border border-[#D4AF37]/15 bg-[#FDFBF7] p-6 rounded-none text-center relative overflow-hidden">
            <div className="absolute inset-2 border border-[#D4AF37]/5 pointer-events-none" />
            <p className="text-[#7A6B5D] text-xs font-sans z-10 relative">
              Please sign in to leave a review.
            </p>
          </div>
        )}

        {/* Reviews List */}
        <ReviewedCard productId={product.product_id} />
      </div>
    </div>
  );
}

export function RenderStars(rating: number, size: "sm" | "md" = "md") {
  const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} stroke-none ${
            star <= rating
              ? "fill-[#D4AF37] text-[#D4AF37]"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}
