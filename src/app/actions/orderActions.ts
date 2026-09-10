"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function submitOrderCancellation(orderId: number, reason: string) {
  try {
    const supabase = await createServerSupabase();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Verify the order belongs to the user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order || order.user_id !== user.id) {
      throw new Error("Order not found or unauthorized");
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        cancellation_reason: reason,
        cancellation_status: 'requested'
      })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in submitOrderCancellation:", error);
    return { success: false, error: error.message };
  }
}
