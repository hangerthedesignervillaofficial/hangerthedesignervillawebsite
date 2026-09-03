"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Search,
  Filter,
  Eye,
  Calendar,
  IndianRupee,
  Package,
  User,
  MapPin,
} from "lucide-react";
import {
  adminOrderService,
  OrderFilters,
  OrderWithDetails,
} from "@/services/admin/adminOrderService";
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { toast } from "sonner";
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal";
import { supabase } from "@/lib/supabase/client";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "packed", label: "Packed" },
  { value: "dispatched", label: "Dispatched" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];



export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<OrderFilters>({});
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(
    null,
  );
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const pageLimit = 20;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.getAllOrders(
        filters,
        currentPage,
        pageLimit,
      );
      setOrders(data.orders);
      setTotalOrders(data.total);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageLimit]);

  useEffect(() => {
    fetchOrders();

    // Subscribe to new orders
    const channel = supabase
      .channel('admin_orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        () => {
          toast.success("New order received!");
          fetchOrders(); // Refresh the list when a new order comes in
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders(); // Refresh on updates
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const handleCancellation = async (orderId: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await supabase.from('orders').update({
          cancellation_status: 'approved',
          status: 'cancelled'
        }).eq('id', orderId);
        toast.success("Cancellation approved");
      } else {
        await supabase.from('orders').update({
          cancellation_status: 'rejected'
        }).eq('id', orderId);
        toast.success("Cancellation rejected");
      }
      fetchOrders();
    } catch (error) {
      toast.error("Failed to process cancellation");
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await adminOrderService.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleFilterChange = (key: keyof OrderFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Search by order ID or customer name/email
      setFilters((prev) => ({
        ...prev,
        // Add search functionality to the service if needed
      }));
    } else {
      const { ...restFilters } = filters;
      setFilters(restFilters);
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalOrders / pageLimit);

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(searchLower) ||
      order.profile?.username?.toLowerCase().includes(searchLower) ||
      order.profile?.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 p-6 md:p-8 bg-[#FDFBF7] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#2C1810] tracking-wide mb-2" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
            Order Management
          </h1>
          <p className="font-sans text-sm text-[#7A6B5D] tracking-wide">
            Track and process customer orders across the boutique
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 border border-[#D4AF37]/30 shadow-sm">
          <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#2C1810] uppercase">
            Total Orders: <span className="text-[#D4AF37]">{totalOrders}</span>
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[#D4AF37]/20 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex flex-1 items-center space-x-2 relative group">
            <Search className="absolute left-3 text-[#D4AF37] h-4 w-4 transition-colors" />
            <input
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 h-10 pl-10 pr-4 bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none font-sans text-sm text-[#2C1810] placeholder:text-[#7A6B5D]/50 transition-colors"
            />
            <button 
              onClick={handleSearch} 
              className="px-6 h-10 bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.2em] uppercase transition-colors"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Filter className="text-[#D4AF37] h-4 w-4 mr-1" />
            
            {/* Status Select */}
            <div className="relative border border-[#D4AF37]/30 bg-transparent h-10 flex items-center min-w-[140px]">
              <select 
                value={filters.status || "all"}
                onChange={(e) => handleFilterChange("status", e.target.value === "all" ? "" : e.target.value)}
                className="w-full h-full bg-transparent px-3 outline-none font-sans text-xs text-[#2C1810] appearance-none cursor-pointer"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#D4AF37]"></div>
              </div>
            </div>

            <div className="relative border border-[#D4AF37]/30 bg-transparent h-10 flex items-center">
              <input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="w-36 h-full bg-transparent px-3 outline-none font-sans text-xs text-[#2C1810] placeholder:text-[#7A6B5D]/50"
              />
            </div>
            
            <span className="text-[#7A6B5D] text-xs px-1">-</span>

            <div className="relative border border-[#D4AF37]/30 bg-transparent h-10 flex items-center">
              <input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="w-36 h-full bg-transparent px-3 outline-none font-sans text-xs text-[#2C1810] placeholder:text-[#7A6B5D]/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border border-[#D4AF37]/20 p-6 shadow-sm hover:border-[#D4AF37]/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-serif text-xl text-[#2C1810]">{order.display_id || `Order #${order.id}`}</h3>
                      <span className={`text-[8px] font-bold tracking-[0.15em] uppercase px-2 py-1 ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                        order.status === ('shipped' as any) ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        order.status === 'processing' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold tracking-[0.15em] text-[#7A6B5D] uppercase block">Date</span>
                        <span className="font-sans text-xs text-[#2C1810] flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" />
                          {order.created_at ? format(new Date(order.created_at), "MMM dd, yyyy") : "No date"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold tracking-[0.15em] text-[#7A6B5D] uppercase block">Customer</span>
                        <span className="font-sans text-xs text-[#2C1810] flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#D4AF37]" />
                          {order.profile?.username || "Guest"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold tracking-[0.15em] text-[#7A6B5D] uppercase block">Amount</span>
                        <span className="font-sans text-xs font-semibold text-[#2C1810] flex items-center gap-1.5">
                          <IndianRupee className="h-3.5 w-3.5 text-[#D4AF37]" />
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold tracking-[0.15em] text-[#7A6B5D] uppercase block">Destination</span>
                        {order.shipping_address ? (
                          <span className="font-sans text-xs text-[#2C1810] flex items-center gap-1.5 truncate">
                            <MapPin className="h-3.5 w-3.5 text-[#D4AF37] flex-shrink-0" />
                            <span className="truncate">{order.shipping_address.city}, {order.shipping_address.state}</span>
                          </span>
                        ) : (
                          <span className="font-sans text-xs text-[#7A6B5D] italic">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>

                  
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 border-t lg:border-t-0 lg:border-l border-[#D4AF37]/20 pt-4 lg:pt-0 lg:pl-6">
                    {order.cancellation_status === 'requested' && (
                      <div className="flex flex-col gap-1 w-full lg:w-auto px-2 py-1 bg-red-50 border border-red-200">
                        <span className="text-[9px] font-bold text-red-600 uppercase">Cancellation Requested:</span>
                        <span className="text-[10px] text-red-800 italic line-clamp-1">{order.cancellation_reason}</span>
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => handleCancellation(order.id, 'approve')} className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-bold uppercase rounded-sm">Approve</button>
                          <button onClick={() => handleCancellation(order.id, 'reject')} className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[8px] font-bold uppercase rounded-sm">Reject</button>
                        </div>
                      </div>
                    )}
                    <div className="relative border border-[#D4AF37]/30 bg-transparent h-10 flex items-center min-w-[140px] flex-1 sm:flex-none">

                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="w-full h-full bg-transparent px-3 outline-none font-sans text-[10px] font-bold tracking-[0.1em] text-[#2C1810] appearance-none uppercase cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#D4AF37]"></div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      className="h-10 px-4 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] font-sans text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center whitespace-nowrap"
                    >
                      <Eye className="h-3 w-3" />
                      View Details
                    </button>
                  </div>
                </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#D4AF37]/20 p-12 text-center flex flex-col items-center">
            <Package className="text-[#D4AF37]/30 mb-4 h-16 w-16 stroke-[1]" />
            <h3 className="font-serif text-2xl text-[#2C1810] mb-2">
              No orders found
            </h3>
            <p className="font-sans text-sm text-[#7A6B5D]">
              No orders match your current filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border border-[#D4AF37]/20 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#7A6B5D] font-bold">
                Showing <span className="text-[#2C1810]">{(currentPage - 1) * pageLimit + 1}</span> to{" "}
                <span className="text-[#2C1810]">{Math.min(currentPage * pageLimit, totalOrders)}</span> of{" "}
                <span className="text-[#2C1810]">{totalOrders}</span> orders
              </span>

              <div className="flex items-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#2C1810] disabled:text-[#7A6B5D]/30 transition-colors"
                >
                  Previous
                </button>

                <span className="font-sans text-[10px] text-[#7A6B5D] tracking-widest uppercase">
                  Page <span className="text-[#2C1810] font-bold">{currentPage}</span> of <span className="text-[#2C1810] font-bold">{totalPages}</span>
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#2C1810] disabled:text-[#7A6B5D]/30 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={showOrderDetails}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
