"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Bell, Check, Clock, Package } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { format } from "date-fns";

interface Notification {
  id: string;
  email: string;
  status: string;
  created_at: string;
  product: {
    product_id: string;
    title: string;
    image: string;
    stock: number;
    price: number;
  };
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("restock_notifications")
        .select(`
          id,
          email,
          status,
          created_at,
          product:products(product_id, title, image, stock, price)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform data as supabase might return array or object for relation
      const formattedData = (data || []).map(item => ({
        ...item,
        product: Array.isArray(item.product) ? item.product[0] : item.product
      })) as unknown as Notification[];
      
      setNotifications(formattedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsNotified = async (id: string) => {
    try {
      const { error } = await supabase
        .from("restock_notifications")
        .update({ status: "notified" })
        .eq("id", id);

      if (error) throw error;
      toast.success("Marked as notified");
      fetchNotifications();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
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
      <div className="container mx-auto space-y-6 py-8 md:py-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-[1px] bg-[#D4AF37]" />
            <span className="text-[8px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
              Admin Panel
            </span>
          </div>
          <h1 className="font-serif text-3xl font-normal tracking-wide text-[#2C1810]" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            Restock Requests
          </h1>
          <p className="font-sans text-[11px] text-[#7A6B5D] tracking-wider uppercase mt-1">
            Manage customer notifications for out-of-stock items
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-[#D4AF37]/15 bg-white shadow-sm">
            <Bell className="text-[#D4AF37]/40 h-12 w-12 mb-4 stroke-[1.5]" />
            <h3 className="font-serif text-lg text-[#2C1810] tracking-wide mb-2" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              No Requests Yet
            </h3>
            <p className="font-sans text-[11px] text-[#7A6B5D] tracking-wide">
              When customers request restock notifications, they will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#D4AF37]/15 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-sm border-collapse">
                <thead className="bg-[#FFFCF7] border-b border-[#D4AF37]/15 text-[10px] font-bold tracking-[0.1em] text-[#2C1810] uppercase">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Customer Email</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4">Requested At</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10">
                  {notifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-[#FFFCF7] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 bg-[#f4f0ea] border border-[#D4AF37]/10 overflow-hidden">
                            {notification.product?.image ? (
                              <Image 
                                src={notification.product.image} 
                                alt={notification.product.title} 
                                fill 
                                className="object-cover" 
                              />
                            ) : (
                              <Package className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#7A6B5D]" />
                            )}
                          </div>
                          <div>
                            <p className="font-serif text-sm text-[#2C1810] line-clamp-1">{notification.product?.title || 'Unknown Product'}</p>
                            <p className="text-[10px] text-[#7A6B5D] tracking-wider mt-0.5 uppercase">₹{notification.product?.price?.toLocaleString() || 0}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[#2C1810]">{notification.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[9px] uppercase tracking-wider font-bold ${notification.product?.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {notification.product?.stock || 0} Units
                        </span>
                      </td>
                      <td className="p-4 text-[11px] text-[#7A6B5D] tracking-wide">
                        {format(new Date(notification.created_at), "MMM d, yyyy h:mm a")}
                      </td>
                      <td className="p-4">
                        {notification.status === "notified" ? (
                          <div className="flex items-center gap-1.5 text-green-700 text-[10px] uppercase font-bold tracking-wider">
                            <Check className="w-3.5 h-3.5" /> Notified
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-orange-600 text-[10px] uppercase font-bold tracking-wider">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {notification.status === "pending" && (
                          <button
                            onClick={() => markAsNotified(notification.id)}
                            className="text-[9px] font-bold tracking-[0.1em] uppercase border border-[#D4AF37] px-3 py-1.5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors cursor-pointer"
                          >
                            Mark Notified
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
