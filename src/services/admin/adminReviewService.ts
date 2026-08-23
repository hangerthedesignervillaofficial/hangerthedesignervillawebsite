import { supabase } from "@/lib/supabase/client";
import { ReviewType } from "@/types";
import { toast } from "sonner";

export const adminReviewService = {
  async getAllReviews(): Promise<ReviewType[]> {
    try {
      // Intentionally omitting status filter to get ALL reviews (pending, approved, rejected)
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profile:profiles(*), product:products(title, image)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching admin reviews:", error);
        toast.error("Failed to load reviews");
        return [];
      }
      return data as ReviewType[];
    } catch (error) {
      console.error("Error in getAllReviews:", error);
      return [];
    }
  },

  async updateReviewStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error("Error updating review status:", error);
        toast.error("Failed to update status");
        return false;
      }
      
      toast.success(`Review ${status}`);
      return true;
    } catch (error) {
      console.error("Error in updateReviewStatus:", error);
      toast.error("Something went wrong");
      return false;
    }
  },
  
  async deleteReview(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting review:", error);
        toast.error("Failed to delete review");
        return false;
      }
      
      toast.success("Review deleted permanently");
      return true;
    } catch (error) {
      console.error("Error in deleteReview:", error);
      toast.error("Something went wrong");
      return false;
    }
  }
};
